<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description: Project Backend về quản lý bán hàng

- Database design: https://app.sqldbm.com/PostgreSQL/DatabaseExplorer/p293754

### Các chức năng của dự án

- Employee: Quản trị bán hàng: Bán hàng, khách hàng.
- Admin: Quản trị nhân sự, account, sản phẩm, danh mục sản phẩm, giỏ hàng và thao tác giỏ hàng, nhà cung cấp, phiếu nhập, đơn nhập, đơn bán, hóa đơn, tích điểm, khuyến mãi.
- Project theo thiết kế microservice: 1 API getway, 1 product service, 1 order service, các service liên lạc bằng RabbitMQ message broker

### Technologies: NestJS, PosgresQL, Prisma, JWT NestJS Guard Passport (Access Token, Refresh Token), Node Mailer, Multer, NestJS Microservice RabbitMQ, AMQP server, SWAGGER

## DEVLOGS:

- [25/03/2024]: Đã hoàn thiện cơ chế authentication với AccessToken và RefreshToken với passport, vẫn chưa hoàn thiện cơ chế guard role (authorization)
- [25/03/2024 - 22h30]: Đã hoàn thiện guard role, đang phát triển file upload multer
- [26/03/2024]: Hoàn thiện upload file, pagination
- [27/03/2024]: Hoàn thiện cơ chế reset password thông qua mailer, cơ chế sử dụng web token lưu vào db và xác thực
- [28/03/2024]: Ngưng code - nghiên cứu chuyển đổi sang kiến trúc microservice
- [29/03/2024]: Repo này trở thành main service (API getway)
- [30/03/2024]: Đã setup xong cơ chế liên lạc với microservice thông qua RabbitMQ message broker, bắt exception từ service, hoàn tất quản lý Product
- [02/04/2024]: Đã hoàn tất setup 3 service (1 API getway, 2 microservice), đang trong quá trình hoàn thiện khâu quy trình nhập hàng (khá khoai)
- [03/04/2024]: Hoàn tất khâu nhập hàng
- [05/04/2024]: Hoàn tất khâu bán hàng, đã xử lý trừ tồn kho, thay đổi dạng thái, tích điểm discount customer, tạo các chi tiết đơn hàng.
- [06/04/2024]: Hoàn thành toàn bộ. Kể từ timeline này, repo đi đến phase update và debug
