# AutoTest_APIs

<style>
  h1 {color:blue;}
  p1 {color:red;}
  h3 {color:green;}
  h5 {color:yellow;}
</style>

<h1>API Testing with newman</h1>
<h3>1. Install npm</h3>
<h5>Install NodeJS</h5>

```bash
sudo apt install nodejs
```
<h5>Install NPM</h5>

```bash
sudo apt install npm
```

<h3>2. Install newman (global) - for user</h3>
<h5>Navigate to node_modules folder</h5>

```bash
cd /usr/local/lib
```
<h5>Install newman</h5>

```bash
npm install -g newman
```

<h5>Install newman-reporter-lar</h5>

```bash
npm install -g newman-reporter-lark
```

<h3>3. Install aws (up to S3)</h3>
<h5>Create package.json</h5>

```bash
npm init
```
<h5>Add dependencies into package.json</h5>

```bash
"dependencies": {
    "newman": "^5.3.2",
    "aws": "^0.0.3-2",
    "aws-sdk": "^2.1122.0"
  }
```
<h5>Install</h5>

```bash
npm install
```

<h3>4. Run newman</h3>
<p1>Use POSTMAN to compose Testscripts</p1>
<br>Export Testscripts to JSON format
<br>Export Environment to JSON format<br>
<h5>Run newman:</h5>

```bash
newman run testcase.json -e environment.json
```
<h5>Run newman with Slack Notification:</h5>

```bash
newman run [path]/testcase.json -e [path]/environment.json -r cli,lark
```
<h3>5. Install newman with package.json - for server only</h3>
<h5>Install dependencies</h5>

```bash
npm install
```

<h3>6. Note(s)</h3>
<p> - Syntax Testing: postman
<br> - Logic Testing (flow, scenario): newman
<br> - Khi install newman theo package.json phải alias lại newman: </p>

```bash
alias newman='./node_modules/.bin/newman'
```

### Dockerizing our application

#### Build a docker image and work on it

<h3>1. Create Dockerfile </h3>
- Guide step by step in this file

<h3>2. Build Docker Image </h3>

```bash
docker build -t sbh-auto-api:v1 .
```

Note:
- Để build Docker image ta dùng command *docker build...
- Option -t để chỉ là đặt tên Image là như thế này cho tôi, và sau đó là tên của image. Các bạn có thể không cần đến option này, nhưng như thế build xong ta sẽ nhận được 1 đoạn code đại diện cho image, và chắc là ta sẽ quên nó sau 3 giây. Nên lời khuyên của mình là LUÔN LUÔN dùng option -t này nhé. Phần tên thì các bạn có thể để tuỳ ý. Ở đây mình lấy là learning-docker/node và gán cho nó tag là v1, ý chỉ đây là phiên bản số 1. Nếu ta không gán tag thì mặc định sẽ được để là latest nhé.
- Cuối cùng mình có 1 dấu "chấm" ý bảo là Docker hãy build Image với context (bối cảnh) ở folder hiện tại này cho tôi. Và Docker sẽ tìm ở folder hiện tại Dockerfile và build.

Xem image của máy (có thể xem trên docker desktop)
```bash
docker images
```

Để xoá image
```bash
docker rmi <Mã của Image>
```

<h3>3. Run project from docker image </h3>
  <h5>3.1. Tạo docker-compose.yml </h5>
  <h5>3.2. Run project </h5>

```bash
docker compose up
```

  <h5>3.3 Restart</h5>

```bash
docker compose down # dừng các container đang chạy
docker compose stop <service_name> # dừng service đang chạy
docker compose up # khởi động lại
```

<h3>4. Bonus</h5>
  <h5>4.1. Xâm nhập vào docker đang chạy</h5>

```bash
docker compose exec <service_name in docker-compose> sh
```

  <h5>4.2. Kiểm tra môi trường chạy (vào trong docker trước)</h5>

```bash
cat /etc/os-release
```
  <h5>4.3. Kiểm tra container đang chạy</h5>

```bash
docker ps
or
docker ps -a
```
  <h5>4.4. Remove container</h5>

```bash
docker rm <container_id>
```
  <h5>4.5. Use Docker Compose to Check Service Status</h5>

```bash
docker-compose ps
```
  <h5>4.6. Run a Command Inside the Container</h5>

```bash
docker exec -it <container_id or container_name> <command>
```
Note: dùng câu lệnh trên để install thêm dependency trong docker (khuyến khích) hoặc build lại (nâng ver)

#### Running our application in a container

```bash
make up
```

#### Stop and remove container

```bash
make down
```

#### Clean up dangling Docker images

```bash
make clean
```
