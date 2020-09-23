import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { GridOptions, ColDef } from 'ag-grid-community/main';
import { Order } from '../Order';

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.css']
})
export class DrillDownComponent {
  gridData: Order[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.gridData  = data.orders.filter(order => order.symbol == data.symbol && order.side == data.side && order.price == data.price);
  }

  columnDefs = [
    <ColDef>{ headerName: 'Symbol', field: 'symbol'},
    <ColDef>{ headerName: 'Side', field: 'side'},
    <ColDef>{ headerName: 'Price', field: 'price'},
    <ColDef>{ headerName: 'Quantity', field: 'quantity'},
  ];

  dataGridOptions: GridOptions = <GridOptions> {
    defaultColDef: { filter: true, sortable: true, resizable: true }
  };

}
