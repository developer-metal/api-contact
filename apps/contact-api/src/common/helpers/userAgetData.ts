import UAParser from 'ua-parser-js';
const userAgent = (agent: string): string => {
    const parser = new UAParser(agent);
    const uaResult = parser.getResult();
    let userAgent: string = agent;
    if (!uaResult?.device?.type || uaResult?.device?.type === 'desktop') {
        userAgent = `DESKTOP (${uaResult?.os?.name?.toUpperCase() ?? ''})`;
        return userAgent;
    } else {
        userAgent = `MOBILE (${uaResult?.os?.name?.toUpperCase() ?? ''})`;
        return userAgent;
    }
}
export {
    userAgent 
};