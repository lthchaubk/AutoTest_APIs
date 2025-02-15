# Ở đầu mỗi file Dockerfile ta luôn phải có FROM. FROM ý chỉ ta bắt đầu từ môi trường nào, môi trường này phải đã được build thành Image
# Làm sao để lấy thông tin của Image thì mình lấy ở Docker hub (https://hub.docker.com/_/node/) nhé.
# FROM node:latest
FROM node:16.14.2

# Tiếp theo ta có từ khoá WORKDIR. Ý chỉ ở bên trong image này, tạo ra cho tôi folder tên là app và chuyển tôi đến đường dẫn /app
# WORKDIR các bạn có thể coi nó tương đương với câu lệnh mkdir /app && cd /app
WORKDIR /auto-api

# Copy toàn bộ code ở môi trường gốc, tức ở folder AutoAPI hiện tại vào bên trong Image ở đường dẫn /app
COPY . .

# RUN để chạy một câu lệnh nào đó khi build Docker Image, ở đây ta cần chạy npm install để cài dependencies
RUN npm install

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# CMD để chỉ câu lệnh mặc định khi mà 1 container được khởi tạo từ Image này
# CMD nhận vào 1 mảng bên trong là các câu lệnh các bạn muốn chạy, cứ 1 dấu cách thì ta viết riêng ra nhé
CMD ["npm", "start"]