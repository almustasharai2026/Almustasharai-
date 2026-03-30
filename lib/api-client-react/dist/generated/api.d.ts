import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminStats, AdminUsersResponse, AuthResponse, ChargeRequest, ChargeResponse, ChatRequest, ChatResponse, ErrorResponse, GenerateDocumentRequest, GenerateDocumentResponse, HealthStatus, LoginRequest, RegisterRequest, UploadFileBody, UploadResponse, UserInfo } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Login
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginRequest: LoginRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginRequest>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Login
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
/**
 * @summary Register new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerRequest: RegisterRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterRequest>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterRequest>;
export type RegisterMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register new user
 */
export declare const useRegister: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterRequest>;
}, TContext>;
/**
 * @summary Send chat message
 */
export declare const getSendMessageUrl: () => string;
export declare const sendMessage: (chatRequest: ChatRequest, options?: RequestInit) => Promise<ChatResponse>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<ChatRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<ChatRequest>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<ChatRequest>;
export type SendMessageMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Send chat message
 */
export declare const useSendMessage: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<ChatRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<ChatRequest>;
}, TContext>;
/**
 * @summary Upload file
 */
export declare const getUploadFileUrl: () => string;
export declare const uploadFile: (uploadFileBody: UploadFileBody, options?: RequestInit) => Promise<UploadResponse>;
export declare const getUploadFileMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadFile>>, TError, {
        data: BodyType<UploadFileBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadFile>>, TError, {
    data: BodyType<UploadFileBody>;
}, TContext>;
export type UploadFileMutationResult = NonNullable<Awaited<ReturnType<typeof uploadFile>>>;
export type UploadFileMutationBody = BodyType<UploadFileBody>;
export type UploadFileMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Upload file
 */
export declare const useUploadFile: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadFile>>, TError, {
        data: BodyType<UploadFileBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadFile>>, TError, {
    data: BodyType<UploadFileBody>;
}, TContext>;
/**
 * @summary Generate legal document
 */
export declare const getGenerateDocumentUrl: () => string;
export declare const generateDocument: (generateDocumentRequest: GenerateDocumentRequest, options?: RequestInit) => Promise<GenerateDocumentResponse>;
export declare const getGenerateDocumentMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateDocument>>, TError, {
        data: BodyType<GenerateDocumentRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof generateDocument>>, TError, {
    data: BodyType<GenerateDocumentRequest>;
}, TContext>;
export type GenerateDocumentMutationResult = NonNullable<Awaited<ReturnType<typeof generateDocument>>>;
export type GenerateDocumentMutationBody = BodyType<GenerateDocumentRequest>;
export type GenerateDocumentMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Generate legal document
 */
export declare const useGenerateDocument: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateDocument>>, TError, {
        data: BodyType<GenerateDocumentRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof generateDocument>>, TError, {
    data: BodyType<GenerateDocumentRequest>;
}, TContext>;
/**
 * @summary Get current user info
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<UserInfo>;
export declare const getGetMeQueryKey: () => readonly ["/api/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current user info
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all users (admin only)
 */
export declare const getAdminGetUsersUrl: () => string;
export declare const adminGetUsers: (options?: RequestInit) => Promise<AdminUsersResponse>;
export declare const getAdminGetUsersQueryKey: () => readonly ["/api/admin/users"];
export declare const getAdminGetUsersQueryOptions: <TData = Awaited<ReturnType<typeof adminGetUsers>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminGetUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminGetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetUsers>>>;
export type AdminGetUsersQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get all users (admin only)
 */
export declare function useAdminGetUsers<TData = Awaited<ReturnType<typeof adminGetUsers>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get admin statistics
 */
export declare const getAdminGetStatsUrl: () => string;
export declare const adminGetStats: (options?: RequestInit) => Promise<AdminStats>;
export declare const getAdminGetStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getAdminGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof adminGetStats>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminGetStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminGetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetStats>>>;
export type AdminGetStatsQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get admin statistics
 */
export declare function useAdminGetStats<TData = Awaited<ReturnType<typeof adminGetStats>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Charge user balance (admin only)
 */
export declare const getAdminChargeUserUrl: () => string;
export declare const adminChargeUser: (chargeRequest: ChargeRequest, options?: RequestInit) => Promise<ChargeResponse>;
export declare const getAdminChargeUserMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminChargeUser>>, TError, {
        data: BodyType<ChargeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminChargeUser>>, TError, {
    data: BodyType<ChargeRequest>;
}, TContext>;
export type AdminChargeUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminChargeUser>>>;
export type AdminChargeUserMutationBody = BodyType<ChargeRequest>;
export type AdminChargeUserMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Charge user balance (admin only)
 */
export declare const useAdminChargeUser: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminChargeUser>>, TError, {
        data: BodyType<ChargeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminChargeUser>>, TError, {
    data: BodyType<ChargeRequest>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map