import { Config, Handlers, PingPongMap, Status } from '.';
import { sleep } from './utils';

/** webSocket 处理函数:> 连接+断线重连+心跳检测 */
export class WebSocketCtrl {
  public config?: Config;
  public handlers = {} as Handlers;
  /** 重连最大次数 */
  private reconnect_max = 5;
  /** 心跳倒计时 - timeout  */
  private heartbeat_timeout: number;
  /** 心跳倒计时 - 运行时间 */
  private heartbeat_time = 5;
  /** ping pong 对应的字符 */
  private ping_pong_map?: PingPongMap;
  public status: Status;
  private is_reset = false;
  constructor(handlers: Handlers, ping_pong_map?: PingPongMap) {
    this.handlers = handlers;
    this.ping_pong_map = ping_pong_map;
    global.socket = this;
  }
  public setConfig(config: Config) {
    this.config = config;
  }
  private async innerConnect() {
    return new Promise<boolean>(async (resolve, _reject) => {
      if (!this.config) {
        return;
      }
      console.warn(`WebSocket:>innerConnect`);
      this.is_reset = false;
      my.connectSocket({
        ...this.config,
        success: () => {
          console.log(`WebSocket:>innerConnect:>success`);
          let abort = false;
          my.onSocketError(async (e) => {
            console.log(`WebSocket:>innerConnect:>onError`);
            // for (const key of Object.keys(e)) {
            //   console.log(`WebSocket:>innerConnect:>onError`, key, e[key]);
            // }
            if (abort) {
              return;
            }
            abort = true;
            my.offSocketError();
            my.offSocketOpen();

            resolve(false);
          });

          my.onSocketOpen(() => {
            console.log(`WebSocket:>innerConnect:>onOpen`);
            if (abort) {
              return;
            }
            abort = true;
            my.offSocketError();
            my.offSocketOpen();

            my.onSocketMessage(this.onMessage);
            my.onSocketClose(this.onClose);
            my.onSocketError(this.onError);
            this.onOpen();
            resolve(true);
          });
        },
        fail: (e) => {
          console.log(`WebSocket:>innerConnect:>fail`);
          for (const key of Object.keys(e)) {
            console.log(`WebSocket:>innerConnect:>onError`, key, e[key]);
          }
          resolve(false);
        },
      } as any);
    });
  }
  public async connect() {
    console.log(`WebSocket:>connect:>`);
    this.status = 'CONNECTING';
    for (let i = 0; i < this.reconnect_max; i++) {
      const connected = await this.innerConnect();
      if (connected) {
        return true;
      } else {
        await sleep(1);
      }
    }
    return false;
  }
  public send(data: string) {
    if (this.status !== 'OPEN') {
      console.error(`socket is no connected! (WebSocketCtrl.send)`, data);
      return;
    }

    return new Promise((resolve) => {
      // console.log(`websocket:>send:>`, data);
      my.sendSocketMessage({
        data,
        success: () => {
          // console.log(`websocket:>send:>success`);
          resolve(true);
        },
        fail: (e) => {
          console.error(`websocket:>send:>fail`, e.errorMessage);
          resolve(false);
          this.reconnect();
        },
      });
    });
  }
  private onOpen = () => {
    console.log(`WebSocket:>onOpen`);

    this.status = 'OPEN';

    if (this.ping_pong_map) {
      this.startHeartBeat();
    }
  };
  private onMessage = (ev: any) => {
    const msg = ev.data as string;
    if (this.ping_pong_map) {
      const { ping, pong } = this.ping_pong_map;
      switch (msg) {
        case ping:
          this.send(pong);
          return;
        case pong:
          this.startHeartBeat();
          return;
      }
    }
    console.log(`websocket:>onMessage`, msg);
    this.handlers.onData?.(msg);
  };
  private onError = () => {
    // console.log(`WebSocket:>onError`);
    this.handlers.onError?.();
  };
  private onClose = () => {
    // console.log(`WebSocket:>onClose`);
    if (this.status !== 'OPEN') {
      return;
    }
    this.reconnect();
  };
  /**
   * 重连
   */
  public async reconnect() {
    if (this.status === 'RECONNECTING') {
      return;
    }

    console.warn(`WebSocket:>reconnect`);
    const { reconnect_max, handlers } = this;

    this.status = 'RECONNECTING';
    for (let i = 0; i < reconnect_max; i++) {
      handlers.onReconnect?.(i);
      await this.reset();
      const connected = await this.innerConnect();
      console.warn(`WebSocket:>reconnect:>time`, i, connected);
      if (connected) {
        this.handlers.onReconnected?.();
        return true;
      } else {
        await sleep(3);
      }
    }

    this.end();
    return false;
  }
  public startHeartBeat() {
    const { heartbeat_time } = this;

    console.log(`WebSocket:>startHeartBeat`);
    clearTimeout(this.heartbeat_timeout);
    this.heartbeat_timeout = setTimeout(() => {
      // console.warn(`WebSocket:>startHeartBeat:>setTimeout`);
      this.reconnect();
    }, heartbeat_time * 1000) as unknown as number;
  }
  /**
   * 暂停连接socket, 接收服务器数据
   */
  public async freeze() {
    console.warn(`WebSocket:>freeze`);
    this.status = 'FREEZE';
    await this.reset();
  }
  /**
   * 断开连接
   */
  public async disconnect() {
    if (this.status === 'CLOSED') {
      return;
    }
    return await this.end();
  }
  /** 真正的关闭 */
  private async end() {
    console.log(`WebSocket:>end`);
    await this.reset();
    this.config = undefined;
    this.status = 'CLOSED';
    this.handlers.onEnd?.();
    this.handlers = {};
  }
  /** 清理本地数据 */
  private reset() {
    console.log(`WebSocket:>reset`);
    return new Promise((resolve) => {
      if (this.is_reset) {
        resolve(false);
        return;
      }
      my?.closeSocket({
        fail: () => {
          console.log(`WebSocket:>reset:>fail`);
          resolve(false);
        },
      });

      my.onSocketClose((res) => {
        console.log('WebSocket 已关闭！', res);
        my.offSocketMessage();
        my.offSocketError();
        my.offSocketOpen();
        my.offSocketClose();
        resolve(true);
      });
    }).then((res) => {
      // console.log('WebSocket:>reset:>2');
      clearTimeout(this.heartbeat_timeout);
      this.is_reset = true;
      return res;
    });
  }
}
