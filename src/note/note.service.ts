import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.noteRepository.create({
      ...createNoteDto,
      userId,
    });
    return this.noteRepository.save(note);
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);

    Object.assign(note, updateNoteDto);
    return this.noteRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.noteRepository.remove(note);
  }
}
