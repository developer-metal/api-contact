export const validApikey = (headers: any, originalUrl: any): boolean => {
    let agentExt: string = String(headers['user-agent']).split('/')[0];
    let validKey: boolean = Boolean(headers['x-api-key']);
    if ((headers.hasOwnProperty('x-api-key') && validKey === true && agentExt != 'PostmanRuntime') || (originalUrl.includes('auth') || originalUrl.includes('generator') )) {
        return true;
    }
    return false;
};