import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyCharset1584019455460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE company CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        await queryRunner.query('ALTER TABLE talent_categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        await queryRunner.query('ALTER TABLE jobs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE company CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        await queryRunner.query('ALTER TABLE talent_categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        await queryRunner.query('ALTER TABLE jobs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');

    }

}
