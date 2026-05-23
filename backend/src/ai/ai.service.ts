import {
    Injectable,
} from '@nestjs/common';

import {
    InjectModel,
} from '@nestjs/sequelize';

import {
    ChatOpenAI,
} from '@langchain/openai';

import {
    PromptTemplate,
} from '@langchain/core/prompts';

import {
    PlayerAiInsight,
} from './entities/player-ai-insight.entity';

import {
    playerEvolutionPrompt,
} from './prompts/player-evolution.prompt';

import {
    PlayerService,
} from '../players/players.service';

import {
    Player,
} from '../players/players.model';

@Injectable()
export class AiService {

    private model =
        new ChatOpenAI({
            apiKey:
                process.env.OPENAI_API_KEY,

            model:
                process.env.OPENAI_MODEL ||
                'gpt-4.1-mini',

            temperature:
                0.5,
        });

    constructor(
        private readonly playersService:
            PlayerService,

        @InjectModel(
            PlayerAiInsight,
        )
        private readonly insightModel:
            typeof PlayerAiInsight,

        @InjectModel(
            Player,
        )
        private readonly playerModel:
            typeof Player,
    ) { }

    // ===== CACHE FIRST =====

    async getPlayerEvolutionInsight(
        playerId: number,
    ) {

        const existing =
            await this.insightModel.findOne({
                where: {
                    player_id:
                        playerId,
                },
            });

        if (existing) {
            return {
                summary:
                    existing.summary,

                cached:
                    true,
            };
        }

        return this
            .regenerateInsight(
                playerId,
            );
    }

    // ===== REGENERATE =====

    async regenerateInsight(
        playerId: number,
    ) {

        const evolution =
            await this.playersService
                .getEvolution(
                    playerId,
                );

        if (
            !evolution?.length
        ) {
            return {
                summary:
                    'No evolution data available.',

                cached:
                    false,
            };
        }

        const player =
            await this.playerModel
                .findByPk(
                    playerId,
                );

        const playerName =
            player?.name ||
            'Player';

        const timeline =
            evolution.map(
                (
                    e: any,
                ) => ({
                    fifa:
                        e.fifa_version
                            ?.version_number,

                    year:
                        e.fifa_version
                            ?.year,

                    pace:
                        e.skills
                            ?.pace || 0,

                    shooting:
                        e.skills
                            ?.shooting || 0,

                    passing:
                        e.skills
                            ?.passing || 0,

                    dribbling:
                        e.skills
                            ?.dribbling || 0,

                    defending:
                        e.skills
                            ?.defending || 0,

                    physic:
                        e.skills
                            ?.physic || 0,

                    overall:
                        e.skills
                            ?.overall || 0,

                    potential:
                        e.skills
                            ?.potential || 0,
                }),
            );

        console.log(
            'AI TIMELINE',
            timeline,
        );

        const prompt =
            PromptTemplate
                .fromTemplate(
                    `
                    {systemPrompt}

                    Jugador:
                    {playerName}

                    Timeline JSON:
                    {timeline}
                    `,
                );

        const formatted =
            await prompt.format({
                systemPrompt:
                    playerEvolutionPrompt,

                playerName,

                timeline:
                    JSON.stringify(
                        timeline,
                        null,
                        2,
                    ),
            });

        const response =
            await this.model.invoke(
                formatted,
            );

        const summary =
            response.content
                ?.toString()
                ?.trim();

        const existing =
            await this.insightModel.findOne({
                where: {
                    player_id:
                        playerId,
                },
            });

        if (existing) {

            existing.summary =
                summary;

            await existing.save();

        } else {

            await this.insightModel.create({
                player_id:
                    playerId,

                summary,
            });
        }

        return {
            summary,
            cached:
                false,
        };
    }
}