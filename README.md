# Laravel + Bref サーバーレスデプロイプロジェクト

このリポジトリは、Laravelアプリケーションを [Bref](https://bref.sh/) を用いてAWS Lambda上にサーバーレスデプロイするためのコードベースです。AWSリソースの構築・管理には [AWS CDK (TypeScript)](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) を利用しています。

## ディレクトリ構成

- `/cdk` … AWS CDKによるインフラ構成（TypeScript）
- `/laravel` … Laravelアプリケーション本体
- `README.md` … 本ファイル

## セットアップ手順（ローカル開発環境）

### 前提条件

- Node.js, npm
- PHP（Laravel用）
- Composer
- AWS CLI（デプロイ用）
- AWSアカウント

### Laravelアプリのセットアップ

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
```

### CDKプロジェクトのセットアップ

```bash
cd ../cdk
npm install
```

## デプロイ手順

1. AWS CLIで認証済みであることを確認
2. CDKでデプロイ

```bash
cd cdk
npx cdk deploy
```

3. Lambda/API Gateway/EFS等のリソースが自動作成され、Laravelアプリがデプロイされます。

## よく使うコマンド

- Laravel
    - `php artisan serve` … ローカルサーバー起動
    - `php artisan migrate` … マイグレーション実行
    - `npm run build` … フロントビルド
- CDK
    - `npm run build` … TypeScriptビルド
    - `npx cdk deploy` … デプロイ
    - `npx cdk diff` … 差分確認
    - `npx cdk synth` … CloudFormationテンプレート出力

## 参考リンク

- [Bref公式ドキュメント](https://bref.sh/docs/)
- [Laravel公式ドキュメント](https://laravel.com/docs/)
- [AWS CDK公式ドキュメント](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
