import 'reflect-metadata';
import Database from "../../database/config/db-connection.js";
import { IDictionarySet } from "../../database/interfaces/DbInterfaces.js";
import logger from "../../utils/logger/Logger.js";
import { inject, injectable } from "tsyringe";

interface AdvancedSearchParameters {
    value?: string;
    type?: string;
    language?: string;
    users?: string[];
    tags?: string[];
}

// !NOT TESTED!
@injectable()
class AdvancedSearchRepository {
    constructor(@inject('Database') private db: Database, private filters: AdvancedSearchParameters) {}

    async search(limit: number, offset: number) {
        const { value, type, language, users, tags } = this.filters;
    
        logger.info("Advanced search initiated with filters:", {
            value,
            type,
            language,
            users,
            tags,
            limit,
            offset
        });
    
        const fetchSets = !type || type === "set";
    
        const perTypeLimit = fetchSets ? limit : limit;
        const perTypeOffset = offset;
    
        const results: Array<IDictionarySet & { tags: string[], ownerName: string }> = [];
        let totalCount = 0;
    
        if (fetchSets) {
            logger.debug("Fetching sets and total count with CTE...");
    
            const data = await this.db.query<{
                dictionarySetId: string,
                name: string,
                description: string,
                languageCode: string,
                isPublic: boolean,
                createdAt: string,
                ownerId: string,
                ownerName: string,
                tags: string[],
                totalCount: number
            }>(
                `
                WITH filtered_sets AS (
                SELECT 
                    s.set_id,
                    s.name,
                    s.description,
                    s.language_code,
                    s.is_public,
                    s.created_at,
                    s.owner_id,
                    u.display_name
                FROM "DictionarySet" s
                JOIN "User" u ON s.owner_id = u.user_id
                WHERE
                    ($1::text IS NULL OR (s.name ILIKE '%' || $1 || '%' OR s.description ILIKE '%' || $1 || '%'))
                    AND ($2::text IS NULL OR s.language_code = $2)
                    AND ($3::text[] IS NULL OR u.username = ANY($3) OR u.display_name = ANY($3))
                    AND (
                        $4::text[] IS NULL OR EXISTS (
                            SELECT 1
                            FROM "SetTag" ts2
                            JOIN "Tag" t2 ON ts2.tag_id = t2.tag_id
                            WHERE ts2.set_id = s.set_id AND t2.name = ANY($4)
                        )
                    )
                ),
                counted AS (
                    SELECT COUNT(*) AS total_count FROM filtered_sets
                )
                SELECT 
                    fs.set_id AS "dictionarySetId",
                    fs.name,
                    fs.description,
                    fs.language_code AS "languageCode",
                    fs.is_public AS "isPublic",
                    fs.created_at AS "createdAt",
                    fs.owner_id AS "ownerId",
                    fs.display_name AS "ownerName",
                    COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags,
                    c.total_count AS "totalCount"
                FROM filtered_sets fs
                LEFT JOIN "SetTag" ts ON ts.set_id = fs.set_id
                LEFT JOIN "Tag" t ON ts.tag_id = t.tag_id
                CROSS JOIN counted c
                GROUP BY fs.set_id, fs.name, fs.description, fs.language_code, fs.is_public, fs.created_at, fs.owner_id, fs.display_name, c.total_count
                LIMIT $5 OFFSET $6;
                `,
                [value || null, language || null, users?.length ? users : null, tags?.length ? tags : null, perTypeLimit, perTypeOffset]
            );
            
            if (data.rows.length > 0) {
                totalCount = data.rows[0].totalCount;
            }
    
            logger.info(`Found ${data.rows.length} sets matching filters.`);
    
            results.push(...data.rows.map(({ createdAt, ...rest }) => ({
                ...rest,
                createdAt: new Date(createdAt),
            })));
        }

        // TODO: implement text search
        /* if (fetchTexts) {
            logger.debug("Fetching texts with limit:", perTypeLimit, "offset:", perTypeOffset);
            const texts = await this.db.query(
                `
                SELECT t.*
                FROM texts t
                WHERE
                    ($1::text IS NULL OR (t.title ILIKE '%' || $1 || '%' OR t.content ILIKE '%' || $1 || '%'))
                    AND ($2::text IS NULL OR t.language = $2)
                    AND ($3::text[] IS NULL OR t.user_id = ANY($3))
                    AND (
                        $4::text[] IS NULL OR EXISTS (
                            SELECT 1 FROM tags_texts tt
                            WHERE tt.text_id = t.id AND tt.tag_id = ANY($4)
                        )
                    )
                LIMIT $5 OFFSET $6;
                `,
                [value || null, language || null, users?.length ? users : null, tags?.length ? tags : null, perTypeLimit, perTypeOffset]
            );
            logger.info(`Found ${texts.rows.length} texts matching filters.`);
            results.push(...texts.rows);
        } */

        logger.info(`Total results returned: ${results.length}`);
        return {
            items: results,
            totalCount,
        };
    }
}

export { AdvancedSearchRepository, AdvancedSearchParameters };