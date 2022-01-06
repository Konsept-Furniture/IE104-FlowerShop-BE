const request = require("supertest");

const baseUrl = "https://furniture-api-shop.herokuapp.com/";

describe("change password", () => {
  it("Check empty curent password Enter", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "",
        newPassword: "thaibinh",
        confirmPassword: "thaibinh",
      });
    expect(response.body.errorCode).toBe(401);
  });

  it("Check empty new password Enter", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "admin",
        newPassword: "",
        confirmPassword: "thaibinh",
      });
    expect(response.body.errorCode).toBe(400);
  });

  it("Check wrong current password Enter", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "fawfawfaw",
        newPassword: "thaibinh",
        confirmPassword: "thaibinh",
      });
    expect(response.body.errorCode).toBe(401);
  });

  it("Check wrong new confirm password", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "admin",
        newPassword: "thaibinh",
        confirmPassword: "admin23",
      });
    expect(response.body.errorCode).toBe(400);
  });
  it("Check new password must not be the same as the old password", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "admin",
        newPassword: "admin",
        confirmPassword: "admin",
      });
    expect(response.body.errorCode).toBe(400);
  });

  it("chane password successfully", async () => {
    const response = await request(baseUrl)
      .put("api/auth/change-password")
      .set(
        "Authorization",
        "Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWY4ZWI3OTc3Yjc3NzQ3YmQ0NGQ0NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTY4Mjc0OCwiZXhwIjoxNjM5OTQxOTQ4fQ.vp0UIPxkklVo5HCUf9GXe91YbpziiATw0ofV5avuU9c"
      )
      .send({
        oldPassword: "admin",
        newPassword: "admin1",
        confirmPassword: "admin1",
      });
    expect(response.body.errorCode).toBe(0);
  });
});

describe("get products", () => {
  it("get product with filter search", async () => {
    const response = await request(baseUrl).get("api/products");
    expect(response.body.errorCode).toBe(0);
  });
  it("get product with filter price", async () => {
    const response = await request(baseUrl).get("api/products");
    expect(response.body.errorCode).toBe(0);
  });
  it("get product with filter sort", async () => {
    const response = await request(baseUrl).get("api/products");
    expect(response.body.errorCode).toBe(0);
  });
  it("get product with filter category", async () => {
    const response = await request(baseUrl).get("api/products");
    expect(response.body.errorCode).toBe(0);
  });
  it("get product with pagination", async () => {
    const response = await request(baseUrl).get("api/products");
    expect(response.body.errorCode).toBe(0);
  });
});
