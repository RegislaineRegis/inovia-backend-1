
export namespace Generic {
  export type Indexable = {
    id: number;
  };
  export type Updatable = Indexable & {
    timestamp: Date;
  };
  export type Entity = Updatable & {
    created: Date;
    deleted?: Date;
  };
  type ExpirableToken = {
    token: string;
    expires: string;
  };
  export type BearerToken = {
    type: 'Bearer';
    access: ExpirableToken;
    refresh: ExpirableToken;
  };
  export type AuthorizedHeader = {
    authorization: `Bearer ${string}`;
  };
  export namespace Search {
    type Without<T, U> = {
      [P in Exclude<keyof T, keyof U>]?: never
    };
    type XOR<T, U> = (T | U) extends object
      ? (Without<T, U> & U)
      | (Without<U, T> & T) : T | U;
    export interface FullText {
      text?: string;
    }
    export namespace Operators {
      export namespace Match {
        export type Positive = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like';
        export type Negative = `n${Positive}`;
      }
      export namespace Range {
        export type Positive = 'in';
        export type Negative = `n${Positive}`;
      }
      export type Match = Match.Positive | Match.Negative;
      export type Range = Range.Positive | Range.Negative;
    }
    export type Operators = Operators.Match | Operators.Range;
    export interface Pagination {
      offset?: number;
      limit?: number;
    }
    export namespace Query {
      export type Where<T extends Indexable> =
        | { [K in keyof T]?: { [O in Operators.Match]?: T[K] } }
        | { [K in keyof T]?: { [O in Operators.Range]?: Array<T[K]> } };
      export namespace Fields {
        export type Select<T> = { select: Array<string & keyof T>; };
        export type Remove<T> = { remove: Array<string & keyof T>; };
      }
      export type Fields<T extends Indexable> = XOR<Fields.Select<T>, Fields.Remove<T>>;
      export type Sort<T extends Indexable> = { [K in keyof T]?: -1 | 1; };
    }
    export type Query<T extends Indexable> = FullText & Pagination & {
      where?: Query.Where<T>;
      fields?: Query.Fields<T>;
      sort?: Query.Sort<T>;
    };
    export type Result<T extends Indexable> = Required<Pagination> & {
      items: Array<T | Partial<T>>;
      total: number;
    };
  }
}
export namespace Model {
  export type User = Generic.Entity & {
    email: string;
    password: string;
  };
  export type Customer = Generic.Entity & {
    user_id?: User['id'];
    name: string;
    address?: string;
    phone?: string;
    birthDate?: Date;
    photoURL?: string;
  };
  export enum SaleStatus {
    Opened = 'opened',
    Closed = 'closed',
    Canceled = 'canceled'
  }
  export type Sale = Generic.Entity & {
    customer_id: Customer['id'];
    status: SaleStatus;
  };
  export type Product = Generic.Entity & {
    name: string;
    price: number;
    brand: string;
    tax: number;
    photoURL?: string;
    miscellaneous: Array<{
      key: string;
      name: string;
      value: string;
    }>;
  };
  export type SaleProduct = Generic.Indexable & {
    sale_id: Sale['id'];
    name: string;
    price: number;
    quantity: number;
    brand: string;
    tax: number;
  };
}
// use cases
export namespace Auth {
  export namespace Login {
    export type Input = {
      body: Pick<Model.User, 'email' | 'password'>;
    };
    export type Output = {
      body: Generic.BearerToken;
    };
  }
  export namespace Refresh {
    export type Input = {
      headers: Generic.AuthorizedHeader;
    };
    export type Output = {
      body: Generic.BearerToken;
    };
  }
}
export namespace Customer {
  export namespace GetFull {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Customer, 'id'>;
    };
    export type Output = {
      body: Model.Customer & {
        user: Omit<Model.User, 'password'>; // for security can't return hashed password
      };
    };
  }
  export namespace Add {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Omit<Model.Customer, keyof Generic.Entity | 'user_id'> & {
        user: Pick<Model.User, 'email' | 'password'>;
      };
    };
    export type Output = {
      body: Model.Customer;
    };
  }
  export namespace Edit {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Customer, 'id'>;
      body: Partial<Omit<Model.Customer, keyof Generic.Entity | 'user_id'>> & {
        user: Partial<Pick<Model.User, 'email' | 'password'>>;
      };
    };
    export type Output = {
      body: Model.Customer;
    };
  }
  export namespace Remove {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Customer, 'id'>;
    };
    export type Output = void;
  }
  export namespace Search {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Generic.Search.Query<Model.Customer>;
    };
    export type Output = {
      body: Generic.Search.Result<Model.Customer>;
    };
  }
}
export namespace Product {
  export namespace GetFull {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Product, 'id'>;
    };
    export type Output = {
      body: Model.Product;
    };
  }
  export namespace Add {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Omit<Model.Product, keyof Generic.Entity>;
    };
    export type Output = {
      body: Model.Product;
    };
  }
  export namespace Edit {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Product, 'id'>;
      body: Partial<Omit<Model.Product, keyof Generic.Entity>>;
    };
    export type Output = {
      body: Model.Product;
    };
  }
  export namespace Remove {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Product, 'id'>;
    };
    export type Output = void;
  }
  export namespace Search {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Generic.Search.Query<Omit<Model.Product, 'miscellaneous'>>;
    };
    export type Output = {
      body: Generic.Search.Result<Omit<Model.Product, 'miscellaneous'>>;
    };
  }
}
export namespace Sale {
  export namespace GetFull {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Sale, 'id'>;
    };
    export type Output = {
      body: Model.Sale & {
        products: Model.SaleProduct[];
      };
    };
  }
  export namespace Add {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Omit<Model.Sale, keyof Generic.Entity> & {
        products: Array<Omit<Model.SaleProduct, keyof Generic.Indexable> | 'sale_id'>;
      };
    };
    export type Output = {
      body: Model.Sale & {
        products: Model.SaleProduct[];
      };
    };
  }
  export namespace Edit {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Sale, 'id'>;
      body: Partial<Omit<Model.Sale, keyof Generic.Entity>> & {
        products?: Array<Omit<Model.SaleProduct, keyof Generic.Indexable> | 'sale_id'>;
      };
    };
    export type Output = {
      body: Model.Sale & {
        products: Model.SaleProduct[];
      };
    };
  }
  export namespace Remove {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      params: Pick<Model.Sale, 'id'>;
    };
    export type Output = void;
  }
  export namespace Search {
    export type Input = {
      headers: Generic.AuthorizedHeader;
      body: Generic.Search.Query<Model.Sale>;
    };
    export type Output = {
      body: Generic.Search.Result<Model.Sale>;
    };
  }
}
