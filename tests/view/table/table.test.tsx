import { mount } from 'enzyme';
import { createContext, h } from 'preact';
import { Table } from '../../../src/view/table/table';
import Header from '../../../src/header';
import { Config } from '../../../src/config';
import StorageUtils from '../../../src/storage/storageUtils';
import Pipeline from '../../../src/pipeline/pipeline';
import StorageExtractor from '../../../src/pipeline/extractor/storage';
import ArrayToTabularTransformer from '../../../src/pipeline/transformer/arrayToTabular';
import { Status, TCell } from '../../../src/types';
import Dispatcher from '../../../src/util/dispatcher';
import { Translator } from '../../../src/i18n/language';
import Tabular from '../../../src/tabular';

describe('Table component', () => {
  let config: Config;
  const configContext = createContext(null);

  beforeEach(() => {
    config = new Config();
    config.data = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];

    config.autoWidth = true;
    config.storage = StorageUtils.createFromUserConfig(config);
    config.dispatcher = new Dispatcher();
    config.translator = new Translator();
    config.pipeline = new Pipeline([
      new StorageExtractor({ storage: config.storage }),
      new ArrayToTabularTransformer(),
    ]);
  });

  it('should render a table', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table data={await config.pipeline.process()} status={Status.Loaded} />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with loading', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table data={await config.pipeline.process()} status={Status.Loading} />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with header', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with width', async () => {
    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          width="300px"
          header={Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] })}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column width', async () => {
    const header = Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].width = '10%';
    header.columns[2].width = '300px';

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with column sort', async () => {
    const header = Header.fromUserConfig({ columns: ['h1', 'h2', 'h3'] });
    header.columns[0].sort = {
      enabled: true,
    };
    header.columns[2].sort = {
      enabled: true,
    };

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without autoFix', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
      autoWidth: false,
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={await config.pipeline.process()}
          header={header}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table without data', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={Tabular.fromArray<TCell>([])}
          header={header}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });

  it('should render a table with null', async () => {
    const header = Header.fromUserConfig({
      columns: ['h1', 'h2', 'h3'],
    });

    const table = mount(
      <configContext.Provider value={config}>
        <Table
          data={null}
          header={header}
          status={Status.Loaded}
        />
      </configContext.Provider>,
    );

    expect(table.html()).toMatchSnapshot();
  });
});
