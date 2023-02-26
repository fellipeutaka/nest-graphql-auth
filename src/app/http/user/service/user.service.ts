import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import { randomUUID } from "node:crypto";

import { PrismaService } from "@app/app/database/prisma.service";

import { ChangePasswordProps } from "../../auth/interfaces/auth.interface";
import { CreateUserProps } from "../interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany();

    return users;
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async create(data: CreateUserProps) {
    const user = await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        createdAt: new Date(),
        ...data,
      },
    });

    return user;
  }

  async updateById(id: string, data: Partial<User>) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async changePassword({
    userId,
    newPassword,
    newPasswordHashed,
  }: ChangePasswordProps) {
    const user = await this.findById(userId);

    if (!user) {
      throw new BadRequestException("User does not exits");
    }

    const isPasswordEqual = await compare(newPassword, user.password);

    if (isPasswordEqual) {
      throw new BadRequestException("Password are the same");
    }

    await this.updateById(userId, {
      password: newPasswordHashed,
    });
  }
}
