export const UPLOAD_INVOICES = `
  mutation UploadInvoicesFile($file: Upload!) {
    uploadInvoicesFile(file: $file) { success message }
  }
`;
