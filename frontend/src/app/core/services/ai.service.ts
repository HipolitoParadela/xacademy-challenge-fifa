import {
    Injectable,
    inject,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    environment,
} from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AiService {

    private http =
        inject(HttpClient);

    private api =
        environment.apiUrl;

    getPlayerInsight(
        playerId: number,
    ) {
        return this.http.get(
            `${this.api}/ai/player-evolution/${playerId}`,
        );
    }

    regeneratePlayerInsight(
        playerId: number,
    ) {
        return this.http.post(
            `${this.api}/ai/player-evolution/${playerId}/regenerate`,
            {},
        );
    }
}