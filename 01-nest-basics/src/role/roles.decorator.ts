import { Reflector } from '@nestjs/core';

export const roles = Reflector.createDecorator<string[]>();
