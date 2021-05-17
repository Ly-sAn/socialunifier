import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { Json } from '../types/global';

function createOAuth(key: string, secret: string) {
    return new OAuth({
        consumer: { key, secret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64');
        },
    });
}

type OAuthRequestConstructor = {
    key: string,
    secret: string,
    method: 'POST' | 'GET',
    url: string,
    tokenKey?: string,
    tokenSecret?: string,
    body?: Json,
}
export class OAuthRequest {
    private oauth: OAuth;
    private request: OAuth.RequestOptions;
    private token: OAuth.Token;
    private body: string;

    constructor(parameters: OAuthRequestConstructor) {
        this.oauth = createOAuth(parameters.key, parameters.secret);
        this.request = { method: parameters.method, url: parameters.url };
        if (parameters.tokenKey && parameters.tokenSecret)
            this.token = { key: parameters.tokenKey, secret: parameters.tokenSecret };
        this.body = parameters.body;
    }

    fetch() {
        const headers = this.oauth.toHeader(this.oauth.authorize(this.request, this.token)) as unknown as HeadersInit;
        if (this.body)
            headers['Content-Type'] = 'application/json';
        
        return fetch(this.request.url, {
            method: this.request.method,
            headers,
            body: JSON.stringify(this.body)
        });
    }

    fetchText() {
        return this.fetch().then(r => r.text());
    }
    
    fetchJson() {
        return this.fetch().then(r => r.json());        
    }
}
