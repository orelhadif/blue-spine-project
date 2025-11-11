export const UPLOAD_CLAIMS = `
  mutation UploadClaimsFile($file: Upload!) {
    uploadClaimsFile(file: $file) { success message }
  }
`;
