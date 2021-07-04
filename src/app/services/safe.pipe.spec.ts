import { DomUserEmail } from './safe.pipe';

describe('DomUserEmail', () => {
  it('create an instance', () => {
    // @ts-ignore
    const pipe = new DomUserEmail();
    expect(pipe).toBeTruthy();
  });
});
