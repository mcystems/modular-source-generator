export interface Engine<T> {
  handleEvent(param: T);
}