import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { EdcaUrlSerializer, EndecapodService, SearchResult} from '@ibfd/endecapod';
import { Observable, Subscription, filter, map, take } from 'rxjs';
import { Option } from './option';
import { Filter } from 'filter';

@Injectable()
export class FilterExposeService extends EndecapodService { }

@Injectable()
export class ResultService extends EndecapodService {}

export interface EneRecord {
  properties: any;
  records?: EneRecord[];
  dimensionValues: any;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: FilterExposeService, useClass: FilterExposeService },
  ],
})
export class AppComponent implements OnInit {
  
  title = 'LittleEndeca';
  result: any | SearchResult;
  data: any;
  collection: {name: string, id: number}[] = [];
  country: {name: string, id: number}[] = [];
  relatedCountry: {name: string, id: number}[] = [];
  region: {name: string, id: number}[] = [];
  organization: {name: string, id: number}[] = [];
  selectedCollection: any;
  selectedRegion:any;
  selectedOrg: any;
  selectedRelatedCountry:any;
  selectedCountry: any;
  collectionOptions: string[] =[];
  offset: number = 0;
  totalRecords: number = 0;


  
  records: EneRecord[]= [];
  properties: any;
  p: any;
  itemContainer: number[] = [];

  test: string[]= ["vllge na", "jibon kster"];

  


  constructor(
    private endecapodService: EndecapodService,
    private filterExposeService: FilterExposeService,
    private urlSerializer: EdcaUrlSerializer,
    private resultService: ResultService,
  ){
    this.endecapodService.setName('endecapodService');
    this.endecapodService.setURL("/endecapod", "/endecapod/my");
    this.endecapodService.RegisterParams(this.urlSerializer.parse("N=0&Ns=sort_date_common|1&Nr=AND(3,10)&Ne=7487&Nu=global_rollup_key&Np=2").queryParamMap);
    this.filterExposeService.setName('filterExposeService');
    this.filterExposeService.setURL("/endecapod", "/endecapod/my");
    this.filterExposeService.setSubscriptionAwareness(true);
    this.filterExposeService.RegisterParams(this.urlSerializer.parse("N=0&Ns=sort_date_common|1&Nr=AND(3,10)&Ne=7487&Nu=global_rollup_key&Np=2").queryParamMap);
    
    this.resultService.setName('filterExposeService');
    this.resultService.setURL("/endecapod", "/endecapod/my");
    this.resultService.setSubscriptionAwareness(true);
    this.resultService.RegisterParams(this.urlSerializer.parse("N=0&Ns=sort_date_common|1&Nr=AND(3,10)&Ne=7487&Nu=global_rollup_key&Np=2").queryParamMap);
  }
  
  ngOnInit(): void {

  

    this.getValues(7487)
      .subscribe(v => {
      this.collection = v.values.map(item =>{
        return {
          "name": item.name,
          "id": item.id
        };
      }
      
      
      );

      console.log("this.collection ",this.collection);

    });
   

    this.getValues(603291)
      .subscribe(v => {
      this.country = v.values.map(item =>{
        return {
          "name": item.name,
          "id": item.id
        };
      });
    });

    this.getValues(603292)
      .subscribe(v => {
      this.relatedCountry = v.values.map(item =>{
        return {
          "name": item.name,
          "id": item.id
        };
      });
    });

    this.getValues(798)
      .subscribe(v => {
      this.region = v.values.map(item =>{
        return {
          "name": item.name,
          "id": item.id
        };
      });
    });

    this.getValues(3290)
      .subscribe(v => {
      this.organization = v.values.map(item =>{
        return {
          "name": item.name,
          "id": item.id
        };
      });
    });


    this.resultService.Result()
      .pipe(filter(v => v instanceof SearchResult))
      .subscribe((res: (SearchResult|any)) => {
        this.result = res;
        this.totalRecords = this.result.result.results.numBins;
        
        console.log(res.result);
        this.process_result();
      });
  }


  process_result(): void {
    this.records = this.result.getRecords();
    console.log("records : ", this.records);
    //debugger
    this.properties=this.records.map(item =>{ 
      return {properties: item.properties};
    });
    this.p = this.properties.map((item:any) =>item.properties);  
  }

  isItemInArray(item: any): boolean {
    return this.itemContainer.some(existingItem => existingItem === item);
  }
  


  onSubmit() {
    //console.log("selectedCollections ", this.selectedCollection);

    //debugger
    
    if(this.selectedCollection && !this.isItemInArray(this.selectedCollection.id))
    {this.itemContainer.push(this.selectedCollection.id);}

    if(this.selectedCountry && !this.isItemInArray(this.selectedCountry.id))
    {this.itemContainer.push(this.selectedCountry.id);}

    if(this.selectedRelatedCountry && !this.isItemInArray(this.selectedRelatedCountry.id))
    {this.itemContainer.push(this.selectedRelatedCountry.id);}

    if(this.selectedRegion && !this.isItemInArray(this.selectedRegion.id))
    {this.itemContainer.push(this.selectedRegion.id);}

    if(this.selectedOrg && !this.isItemInArray(this.selectedOrg.id))
    {this.itemContainer.push(this.selectedCollection.id);}

    console.log(" itemContainer : ", this.itemContainer);
    //debugger

    this.funSubmit(this.itemContainer);


  }
  funSubmit(n: number[]){
    //console.log(" n: ", n);
    //debugger
    this.resultService.Copy(this.endecapodService);
    n.forEach(item => this.resultService.AddN(item));
    this.resultService.setDym(false);
    this.resultService.Paginate(this.offset);
    this.resultService.DoSearch();
    

  }

  previous(){
    if(this.offset - 10 < 0){
      this.offset =0;
    }
    else{
      this.offset = this.offset - 10;
    }
    this.funSubmit(this.itemContainer);

  }

  next(){
    this.offset = this.offset + 10;
    this.funSubmit(this.itemContainer);

  }

  

  getValues(id: any): Observable<Option> {
    
    this.filterExposeService.setName(id + '-ExposeService');
    this.filterExposeService.Copy(this.endecapodService);
    this.filterExposeService.setDym(false);
    this.filterExposeService.SetNe([id]);
    return this.filterExposeService.Query()
      .pipe(
        filter(f => !!f),
        map(r => new SearchResult(r)),
        take(1),
        map((res: SearchResult) => this.toOption(res, id))
      );
  }

  

  private toOption(res: SearchResult, id: any): Option {

  //  console.log("searchResult ", res);
    //console.log(res.getDimension(id));
    //debugger
    return <Option>{
      values: res.getDimension(id) && res.getDimension(id).values ? res.getDimension(id).values : []
    };
  }
}
