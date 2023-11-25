module.exports = ((redis) => {
  class DataStore {
    static get MAX_RETRY_COUNT() {
      return 100
    }

    static get RETRY_INTERVAL_MS() {
      return 100;
    }

    constructor(prefix) {
      this.prefix = prefix;
    }

    getKey(id) {
      return `${this.prefix}:${id}`;
    }

    async find(id) {
      const key = this.getKey(id);
      const entity = new Entity(redis, key);
      if (!(await entity.getState())) {
        return false;
      }
      return entity;
    }

    async create(id, defaultState) {
      const key = this.getKey(id);
      await redis.set(key, JSON.stringify(defaultState), {
        EX: Entity.VAL_TTL,
        NX: true,
      });
      return new Entity(redis, key);
    }

    async delete(id) {
      const key = this.getKey(id);
      const entity = new Entity(redis, key);
      return await entity.delete();
    }

    async transaction(id, callback) {
      let writable = await this.lock(id);
      if (!writable) {
        writable = await this.wait(id, DataStore.MAX_RETRY_COUNT);
      }
      const key = this.getKey(id);
      await callback(new StatefulEntity(redis, key));
      await this.unlock(id);
    }

    async lock(id) {
      const key = this.getKey(id);
      return !!(await redis.set(`lock:${key}`, '1', {
        EX: Math.ceil(
          (DataStore.RETRY_INTERVAL_MS / 1000) * DataStore.MAX_RETRY_COUNT,
        ),
        NX: true,
      }));
    }

    async unlock(id) {
      const key = this.getKey(id);
      await redis.del(`lock:${key}`);
      return true;
    }


   async wait(id, retryCount) {
     if (retryCount < 0) {
       throw new Error('Exceed MAX_RETRY_COUNT');
     }

     await new Promise((resolve) =>
       setTimeout(resolve, DataStore.RETRY_INTERVAL_MS),
     );
     if (await this.lock(id)) {
       return true;
     }
     return this.wait(id, --retryCount);
   }
  }

  class Entity {
    static get VAL_TTL() {
      return 60 * 60 * 24; // Expires in a day
    }

    constructor(redis, key) {
      this.redis = redis;
      this.key = key;
    }

    async getState() {
      const val = await this.redis.get(this.key);
      return val && JSON.parse(val);
    }

    async setState(state) {
      const nextState = {
        ...((await this.getState()) || {}),
        ...state,
      };

      await this.redis.set(this.key, JSON.stringify(nextState), {
        EX: Entity.VAL_TTL
      });

      return nextState;
    }

    async delete() {
      await this.redis.del(this.key);
      return true;
    }
  }

  class StatefulEntity extends Entity {
    async getState() {
      this.state ??= await super.getState();
      return this.state;
    }

    async setState(state) {
      this.state = await super.setState(state);
      return this.state;
    }

    async delete() {
      await super.delete();
      this.state = null;
      return true;
    }
  }

  return DataStore;
});
