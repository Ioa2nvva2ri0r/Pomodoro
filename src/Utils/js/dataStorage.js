export default function dataStorage({
  storage = localStorage,
  key = 'test',
  method = 'GET',
  data = {},
}) {
  if (storage === localStorage || storage === sessionStorage) {
    if (typeof key !== 'string')
      throw new SyntaxError('Key value can only be of type "string"!');
    const getItem = () => JSON.parse(storage.getItem(key));
    const setItem = (value) => storage.setItem(key, JSON.stringify(value));
    const getChangeData = (data) => {
      if (method === 'CLEAR') {
        storage.removeItem(key);
        setItem([]);
      } else setItem(data);

      return getItem();
    };

    !getItem() && setItem([]);
    let store = getItem();
    const index =
      store.length !== 0 &&
      data instanceof Object &&
      Object.keys(data).length !== 0
        ? store.findIndex(({ id }) => id === data.id)
        : 0;

    switch (method) {
      case 'GET':
        return store;
      case 'POST':
        return getChangeData([...store, data]);
      case 'PUT':
        return getChangeData(data);
      case 'PATCH': {
        if (index !== -1)
          store.splice(
            index,
            1,
            Object.fromEntries(
              Object.entries(store[index]).map(([key, value]) =>
                data[key] && key !== 'id' ? [key, data[key]] : [key, value]
              )
            )
          );
        return getChangeData(store);
      }
      case 'DELETE': {
        index !== -1 && store.splice(index, 1);
        return getChangeData(store);
      }
      case 'CLEAR':
        return getChangeData();
    }
  } else
    throw new SyntaxError(
      'Storage can only be of type "localStorage" or "sessionStorage"!'
    );
}
