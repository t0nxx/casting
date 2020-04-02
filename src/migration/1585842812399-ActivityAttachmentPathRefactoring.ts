import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivityAttachmentPathRefactoring1585842812399 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `activity_attachment`  MODIFY path TEXT NOT NULL;');
    }


    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `activity_attachment`  MODIFY path TEXT NOT NULL;');
    }

}
