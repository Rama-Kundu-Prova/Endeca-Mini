
import { Option } from "src/app/option";

export enum FilterType {
    MSELECT = 'multiselect',
    SSELECT = 'singleselect',
    DATERANGE = 'daterange',
}
/**
 * A configured filter
 * SELECTs must have an N
 * DATEs must have a propName
 */
export interface Filter {
    readonly N?: number;
    option: Option;
    readonly propName?: string;
    alias?: string;
    readonly load_on_init?: boolean;
    readonly type?: FilterType;
}
