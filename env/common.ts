module.exports = {
  siteName: '『大正新脩大蔵経』底本・校本データベース',
  siteNameEn: '『大正新脩大蔵経』底本・校本データベース',

  siteDesc:
    '『大正新脩大蔵経』底本・校本データベース（以下「本データベース」と称す）は、『大正新脩大蔵経』（以下「大正蔵」と称す）の第一期刊行事業において刊行された正蔵部分第 1～55 巻を対象に、『昭和法宝総目録』第 1 巻 pp.153～656 掲載の『大正新脩大蔵経勘同目録』（以下「『勘同目録』」と称す）に記載される各経典の底本・校本に関する情報と、大正蔵第 1～55 巻の脚注に記載される底本・校本に関する情報とを収集した上で、『勘同目録』・脚注双方の情報を対照させたものであり、各経典の底本・校本に関する情報を一覧できるようにし、大正蔵を利用した仏教研究に資することを目的とする。',
  siteDescEn:
    '『大正新脩大蔵経』底本・校本データベース（以下「本データベース」と称す）は、『大正新脩大蔵経』（以下「大正蔵」と称す）の第一期刊行事業において刊行された正蔵部分第 1～55 巻を対象に、『昭和法宝総目録』第 1 巻 pp.153～656 掲載の『大正新脩大蔵経勘同目録』（以下「『勘同目録』」と称す）に記載される各経典の底本・校本に関する情報と、大正蔵第 1～55 巻の脚注に記載される底本・校本に関する情報とを収集した上で、『勘同目録』・脚注双方の情報を対照させたものであり、各経典の底本・校本に関する情報を一覧できるようにし、大正蔵を利用した仏教研究に資することを目的とする。',

  // 共通
  bc: true,

  // 検索

  config: {
    default: {
      label: '検索',
      index: 'index.json',
      to: {
        name: 'search-slug',
      },
      aggs: {
        '基-収録巻次': {
          sort: 'name:asc',
          label: '基本情報-収録巻次',
          value: {},
          key: '基-収録巻次',
          more: false,
        },
        '基-経典番号': {
          sort: '',
          label: '基本情報-経典番号',
          value: {},
          key: '基-経典番号',
          more: false,
        },
        '基-部門': {
          // sort: 'name:asc',
          label: '基本情報-部門',
          value: {},
          key: '基-部門',
          more: false,
        },
        '基-配本': {
          // sort: 'name:asc',
          label: '基本情報-配本',
          value: {},
          key: '基-配本',
          more: false,
        },
        '勘-底本/校本': {
          // sort: 'name:asc',
          label: '勘同目録-底本/校本',
          key: '勘-底本/校本',
          value: {},
          more: false,
        },
        '勘同目録-テキスト': {
          // sort: 'name:asc',
          label: '勘同目録-テキスト',
          key: '勘同目録-テキスト',
          value: {},
          more: false,
        },
        '脚-底本/校本': {
          // sort: 'name:asc',
          label: '脚注-底本/校本',
          key: '脚-底本/校本',
          value: {},
          more: false,
        },
        '脚注-テキスト': {
          // sort: 'name:asc',
          label: '脚注-テキスト',
          key: '脚注-テキスト',
          value: {},
          more: false,
        },
        画像: {
          // sort: 'name:asc',
          label: '画像',
          key: '画像',
          value: {},
          more: false,
        },
      },
      // sort: [{ label: '適合度', value: '_score' }],
      sort: [
        { label: '適合度', value: '_score' },
        // { label: '基-経典番号', value: 'objectID' },
        { label: '基本情報-配本', value: '基-配本' },
      ],
      defaultSort: '_score:desc',
      layout: [
        {
          label: 'table',
          value: 'table',
          icon: 'mdi-table',
          component: 'custom-search-layout-table',
        },
        {
          label: 'graph',
          value: 'graph',
          icon: 'mdi-chart-bar',
          component: 'search-layout-graph',
        },
      ],
      defaultLayout: 'table',
      advanced: [],
      itemPerPages: [20, 50, 100, 500],
      defaultItemPerPage: 20,
      hide: [], // 詳細？,
      list: [], // 検索結果一覧
    },
  },

  norm: 'static/norm.json',

  // カスタム
  'u-renja': 'https://taishozo.github.io/u-renja',
}
