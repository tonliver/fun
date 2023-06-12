export default interface IThenable {
  then(onFulfilled: () => any, onReject): Promise<any>;
}
