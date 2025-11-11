import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface GraphqlResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

function opName(doc: string): string {
    const m = /(query|mutation|subscription)\s+([A-Za-z0-9_]+)/.exec(doc);
    return m?.[2] ?? 'AnonymousOperation';
}

@Injectable({ providedIn: 'root' })
export class GraphqlHttpService {
    // adjust if your backend runs elsewhere
    private readonly url = 'http://localhost:8000/graphql';

    constructor(private http: HttpClient) {}

    /** JSON-based GraphQL (queries/mutations without files) */
    execute<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
        const operationName = opName(query);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-apollo-operation-name': operationName,
        });

        const body = { query, variables: variables ?? {}, operationName };

        return this.http.post<GraphqlResponse<T>>(this.url, body, { headers }).pipe(
            map((res) => {
                if (res.errors?.length) throw new Error(res.errors.map(e => e.message).join('; '));
                return res.data as T;
            })
        );
    }

    /** Multipart GraphQL file upload (apollo-upload spec) */
    uploadFile<T>(
        mutation: string,
        file: File | Blob,
        variables: Record<string, unknown> = {}
    ): Observable<T> {
        const operationName = opName(mutation);

        const form = new FormData();
        form.append('operations', JSON.stringify({
            query: mutation,
            operationName,
            variables: { ...variables, file: null },
        }));
        form.append('map', JSON.stringify({ '0': ['variables.file'] }));
        form.append('0', file as any);

        const headers = new HttpHeaders({
            'x-apollo-operation-name': operationName,
            'apollo-require-preflight': 'true', // satisfies Apollo Server CSRF guard
        });

        return this.http.post<GraphqlResponse<T>>(this.url, form, { headers }).pipe(
            map((res) => {
                if (res.errors?.length) throw new Error(res.errors.map(e => e.message).join('; '));
                return res.data as T;
            })
        );
    }
}