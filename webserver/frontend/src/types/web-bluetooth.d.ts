declare global {
  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    value: DataView;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  }
}
