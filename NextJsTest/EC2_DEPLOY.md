# EC2에 Next.js 배포하기 (Termius 사용)

## 📋 사전 준비

1. EC2 인스턴스 생성 (Ubuntu 22.04 LTS 권장)
2. 보안 그룹에서 포트 3000 열기
3. EC2 키 페어 파일 준비
4. [Termius 앱 다운로드](https://termius.com/) (PC 또는 모바일)

---

## 🔌 Termius로 EC2 접속하기

### 1. Termius에서 새 호스트 추가
1. Termius 앱 실행
2. `+` 또는 "Add Host" 클릭
3. 다음 정보 입력:
   - **Label**: EC2 Server (원하는 이름)
   - **Address**: your-ec2-ip (EC2 퍼블릭 IP)
   - **Username**: ubuntu
   - **Identity**: Select Key → .pem 키 파일 선택
   - **Port**: 22

### 2. SSH 접속
- 저장한 호스트를 탭하면 자동으로 SSH 접속
- 터미널 창이 열림

---

## 🔧 EC2 인스턴스 설정

### 2. Node.js 설치
```bash
# Node.js 18 LTS 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 설치 확인
node -v
npm -v
```

### 3. PM2 설치
```bash
sudo npm install -g pm2
```

### 4. Git 설치
```bash
sudo apt-get install git -y
```

---

## 📦 프로젝트 배포

### 1. 프로젝트 클론
```bash
cd ~
git clone <your-repo-url> NextJsTest
cd NextJsTest
```

### 2. 의존성 설치
```bash
npm install --legacy-peer-deps
```

### 3. 빌드
```bash
npm run build
```

### 4. PM2로 앱 실행
```bash
# 앱 시작
pm2 start npm --name "nextjs-app" -- start

# 부팅 시 자동 시작 설정
pm2 save
pm2 startup

# 나온 명령어 실행 (예: sudo env PATH=... pm2 startup ...)
```

---

## 🌐 Nginx 설정 (80포트 사용하려면)

### 1. Nginx 설치
```bash
sudo apt-get install nginx -y
```

### 2. Nginx 설정 파일 수정
```bash
sudo nano /etc/nginx/sites-available/default
```

다음 내용으로 교체:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 _ (모든 도메인)

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Nginx 재시작
```bash
sudo nginx -t  # 설정 테스트
sudo systemctl restart nginx
```

---

## 🔄 업데이트 배포

### 방법 1: 직접 SSH 접속
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
cd ~/NextJsTest
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart nextjs-app
```

### 방법 2: 배포 스크립트 작성
`update.sh` 파일 생성:
```bash
#!/bin/bash
cd ~/NextJsTest
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart nextjs-app
echo "✅ 배포 완료!"
```

실행:
```bash
chmod +x update.sh
./update.sh
```

---

## 🛠️ PM2 주요 명령어

```bash
# 앱 목록
pm2 list

# 로그 확인
pm2 logs nextjs-app

# 로그 실시간 확인
pm2 logs nextjs-app --lines 100

# 앱 재시작
pm2 restart nextjs-app

# 앱 중지
pm2 stop nextjs-app

# 앱 삭제
pm2 delete nextjs-app

# 전체 재시작
pm2 restart all
```

---

## 🌍 환경 변수 설정

### 1. .env.production 파일 생성
```bash
nano ~/NextJsTest/.env.production
```

내용:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

### 2. PM2 재시작
```bash
pm2 restart nextjs-app
```

---

## 🔍 트러블슈팅

### 포트 3000이 이미 사용 중
```bash
# 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

### 빌드 실패 (peer dependency)
```bash
npm install --legacy-peer-deps
```

### 메모리 부족
```bash
# 스왑 메모리 추가
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📍 접속 방법

- **직접 포트 3000 접속**: `http://your-ec2-ip:3000`
- **Nginx 사용 시**: `http://your-ec2-ip` 또는 `http://your-domain.com`

