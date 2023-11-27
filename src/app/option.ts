

export enum FilterKind {
  GRID,
  GRID_COLUMN,
  URL
}
export interface Option {
  
    id: any;
    disabled: boolean;
    pfx: string;
    name: string;

    
    values: Option[];
    
    selectedValues: Option[];
    multi: boolean;
    exposed: boolean;
    //filler: FilterValueService;
    kind: FilterKind;
    dimId?: number;
    
  }
