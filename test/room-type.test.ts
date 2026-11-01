import { describe, it, expect } from 'vitest';
import { resolveRoomType } from '../src/utils/room-type';

const area = (name: string, icon: string | null = null) => ({ name, icon });

describe('resolveRoomType', () => {
  it('uses an explicitly configured room type', () => {
    expect(resolveRoomType({ room_type: 'kitchen' }, area('Office', 'mdi:desk'))).toEqual({
      type: 'kitchen',
      explicit: true,
    });
  });

  it('returns nothing when scenes are turned off', () => {
    expect(resolveRoomType({ room_type: 'none' }, area('Kitchen'))).toBeNull();
  });

  it('matches the area icon before the name', () => {
    expect(resolveRoomType({}, area('Kitchen', 'mdi:sofa-outline'))).toEqual({
      type: 'living',
      explicit: false,
    });
  });

  it('matches icon prefixes only on a word boundary', () => {
    expect(resolveRoomType({}, area('Room', 'mdi:bed-king'))?.type).toBe('bedroom');
    expect(resolveRoomType({}, area('Room', 'mdi:bedside'))).toBeNull();
  });

  it('prefers the more specific icon', () => {
    expect(resolveRoomType({}, area('Room', 'mdi:silverware-fork-knife'))?.type).toBe('dining');
    expect(resolveRoomType({}, area('Room', 'mdi:silverware-spoon'))?.type).toBe('kitchen');
  });

  it('matches English area names', () => {
    expect(resolveRoomType({ room_type: 'auto' }, area('Master Bathroom'))?.type).toBe('bathroom');
    expect(resolveRoomType({}, area('Kids Bedroom'))?.type).toBe('kids');
    expect(resolveRoomType({}, area('Back Garden'))?.type).toBe('outdoor');
    expect(resolveRoomType({}, area('Guest room'))?.type).toBe('bedroom');
  });

  it('matches Hebrew area names', () => {
    expect(resolveRoomType({}, area('סלון'))?.type).toBe('living');
    expect(resolveRoomType({}, area('חדר שינה הורים'))?.type).toBe('bedroom');
    expect(resolveRoomType({}, area('מקלחת הורים'))?.type).toBe('bathroom');
    expect(resolveRoomType({}, area('חדר ילדים'))?.type).toBe('kids');
  });

  it('falls back to the card name when there is no area', () => {
    expect(resolveRoomType({ name: 'Kitchen' }, undefined)?.type).toBe('kitchen');
  });

  it('returns nothing when nothing matches', () => {
    expect(resolveRoomType({}, area('Hallway', 'mdi:door'))).toBeNull();
  });
});
