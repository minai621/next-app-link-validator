export interface ValidationResult {
    url: string;
    status: number;
    isValid: boolean;
}
export declare const validateUrls: (urls: string[], baseUrl: string) => Promise<ValidationResult[]>;
