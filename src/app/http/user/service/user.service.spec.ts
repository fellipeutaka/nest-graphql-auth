import { BadRequestException } from "@nestjs/common";
import type { User } from "@prisma/client";
import { randomUUID } from "crypto";

import { mockPrismaService } from "@app/app/database/prisma.mock";
import { hashData } from "@app/utils/hashData";

import { UserService } from "./user.service";

function createUser(props: User) {
  return props;
}

describe("User service", () => {
  const randomUser = createUser({
    id: "john_doe-0279-40bc-8b9c-41a74b50872d",
    email: "johndoe@email.com",
    fullName: "John Doe",
    username: "john_doe123",
    password: "IL0v3P0t4t03s<3",
    createdAt: new Date(),
    emailVerifiedAt: null,
    refreshToken: null,
  });
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockPrismaService);
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      mockPrismaService.user.findMany.mockResolvedValueOnce([randomUser]);
      const users = await userService.findAll();
      expect(users).toEqual([randomUser]);
    });
  });

  describe("findById", () => {
    it("should return a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(randomUser);
      const user = await userService.findById(randomUser.id);
      expect(user).toEqual(randomUser);
    });
  });

  describe("findByEmail", () => {
    it("should return a user by email", async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(randomUser);
      const user = await userService.findByEmail(randomUser.email);
      expect(user).toEqual(randomUser);
    });
  });

  describe("findByUsername", () => {
    it("should return a user by username", async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(randomUser);
      const user = await userService.findByUsername(randomUser.username);
      expect(user).toEqual(randomUser);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = createUser({
        id: "jane_doe-0279-40bc-8b9c-41a74b50872d",
        email: "janedoe@email.com",
        fullName: "Jane Doe",
        username: "jane_doe123",
        password: "IL0v3P0t4t03s<3",
        createdAt: new Date(),
        emailVerifiedAt: null,
        refreshToken: null,
      });

      mockPrismaService.user.create.mockResolvedValueOnce(newUser);

      const createdUser = await userService.create(newUser);

      expect(createdUser).toEqual(newUser);
    });
  });

  describe("updateById", () => {
    it("should update a user by id", async () => {
      const updatedUser = createUser({
        ...randomUser,
        email: "new_email@example.com",
        fullName: "New Name",
      });

      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);

      await userService.updateById(randomUser.id, {
        email: "new_email@example.com",
        fullName: "New Name",
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: randomUser.id,
        },
        data: {
          email: "new_email@example.com",
          fullName: "New Name",
        },
      });
    });
  });

  describe("changePassword", () => {
    const newPassword = "new_password123";

    it("should change a user's password", async () => {
      const hashedPassword = await hashData(newPassword);
      const updatedUser = {
        ...randomUser,
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(randomUser);
      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);

      await userService.changePassword({
        userId: randomUser.id,
        newPassword,
        newPasswordHashed: hashedPassword,
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: randomUser.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    });

    it("should throw a BadRequestException if user does not exist", async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      const hashedPassword = await hashData(newPassword);

      await expect(
        userService.changePassword({
          userId: randomUUID(),
          newPassword,
          newPasswordHashed: hashedPassword,
        })
      ).rejects.toThrowError(new BadRequestException("User does not exits"));
    });

    it("should throw a BadRequestException if new password is the same as the old one", async () => {
      const hashedPassword = await hashData(randomUser.password);
      const updatedUser = {
        ...randomUser,
        password: hashedPassword,
      };
      mockPrismaService.user.findUnique.mockResolvedValueOnce(updatedUser);

      await expect(
        userService.changePassword({
          userId: randomUser.id,
          newPassword: randomUser.password,
          newPasswordHashed: hashedPassword,
        })
      ).rejects.toThrowError(new BadRequestException("Password are the same"));
    });
  });
});
