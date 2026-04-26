export * from './subjects.service';
import { SubjectsService } from './subjects.service';
export * from './tasks.service';
import { TasksService } from './tasks.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [SubjectsService, TasksService, UsersService];
