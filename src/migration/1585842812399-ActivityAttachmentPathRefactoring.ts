import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivityAttachmentPathRefactoring1585842812399 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `activity_attachment` CHANGE `path` `path` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `activity_attachment` CHANGE `path` `path` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;');
    }

}
