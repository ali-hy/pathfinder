export interface PriorityQueueNode<T> {
  value: T;
  priority: number;
}

export default class PriorityQueue<T> {
  private heap: PriorityQueueNode<T>[];
  private set: Set<T>;

  get size(){
    return this.heap.length;
  }

  constructor() {
    this.heap = [];
    this.set = new Set();
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return index * 2 + 1;
  }

  private getRightChildIndex(index: number): number {
    return index * 2 + 2;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].priority > this.heap[index].priority) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      let smallerChildIndex = index;
      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].priority < this.heap[smallerChildIndex].priority) {
        smallerChildIndex = leftChildIndex;
      }
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority) {
        smallerChildIndex = rightChildIndex;
      }
      if (smallerChildIndex !== index) {
        this.swap(smallerChildIndex, index);
        index = smallerChildIndex;
      } else {
        break;
      }
    }
  }

  enqueue(value: T, priority: number): void {
    const node: PriorityQueueNode<T> = { value, priority };
    const prevSize = this.set.size;
    this.set.add(value);
    if(this.set.size === prevSize){
      return;
    }
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    if (this.heap.length === 1) {
      this.set.clear();
      return this.heap.pop()!.value;
    }
    const result = this.heap[0].value;
    this.heap[0] = this.heap.pop()!;
    this.set.delete(result);
    this.bubbleDown(0);
    return result;
  }

  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0].value : undefined;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}