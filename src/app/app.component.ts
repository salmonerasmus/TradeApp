import { Component } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community/main';
import { MatDialog } from '@angular/material/dialog';
import { DrillDownComponent } from './drill-down/drill-down.component';
import { Order } from './Order';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent { 
  title: string = "TradeOrderBook";
  sides: string[] = ["Buy", "Sell"];
  orders: Order[] = [
    { symbol: 'IBM', side: 'Buy', price: 120.74, quantity: 200},
    { symbol: 'IBM', side: 'Buy', price: 120.74, quantity: 100},
    { symbol: 'IBM', side: 'Sell', price: 122.79, quantity: 200},
    { symbol: 'AAPL', side: 'Buy', price: 110.74, quantity: 100},
    { symbol: 'AAPL', side: 'Buy', price: 110.74, quantity: 200},
    { symbol: 'AAPL', side: 'Buy', price: 110.74, quantity: 300},
    { symbol: 'AAPL', side: 'Sell', price: 111.79, quantity: 200},
    { symbol: 'AAPL', side: 'Sell', price: 111.79, quantity: 100},
  ];

  gridData: OrderBook[] = [];

  symbol: string = "";
  side: string = "";
  price: number = 0;
  quantity: number = 0;
  checkMsg:string = "";

  constructor(
    private dialog: MatDialog
  ) {
     this.refreshGridData();
  }

  refreshGridData() {
    this.gridData = [];
    this.orders.forEach(order => {
        let symbolOrderBook = this.gridData.filter(x=> x.Symbol == order.symbol && x.Side == order.side && x.Price == order.price);
        if (symbolOrderBook.length != 0) {
          symbolOrderBook[0].Quantity = Number(symbolOrderBook[0].Quantity) + Number(order.quantity);
          symbolOrderBook[0].OrderCount = Number(symbolOrderBook[0].OrderCount) + 1;
        } else {
          let newSymbolOrderBook = new OrderBook();
          newSymbolOrderBook.Symbol = order.symbol;
          newSymbolOrderBook.Side = order.side;
          newSymbolOrderBook.Price = order.price;
          newSymbolOrderBook.Quantity = order.quantity;
          newSymbolOrderBook.OrderCount = 1;
          this.gridData.push(newSymbolOrderBook);
        }
    });
  }

  columnDefs = [
    <ColDef>{ headerName: 'Symbol', field: 'Symbol'},
    <ColDef>{ headerName: 'Side', field: 'Side'},
    <ColDef>{ headerName: 'Price', field: 'Price'},
    <ColDef>{ headerName: 'Quantity', field: 'Quantity'},
    <ColDef>{ headerName: 'OrderCount', field: 'OrderCount'}
  ];

  
  dataGridOptions: GridOptions = <GridOptions> {
      defaultColDef: { filter: true, sortable: true, resizable: true },
      onRowDoubleClicked: (params) => {		
        var colName = (<HTMLInputElement>params.event.target).getAttribute('col-id');
        this.openDrillDown(params.node.data);
      }
  };

    
  openDrillDown(data: any) {
    let dialogRef = this.dialog.open(DrillDownComponent, {
      height: '90vh',
      width: '80vw',
      data: {
        orders: this.orders,
        symbol: data.Symbol,
        side: data.Side,
        price: data.Price
      }
    });
  }

  placeOrder(){
    if (this.symbol== "" || this.side == "" || this.price == 0 || this.quantity == 0)
      this.checkMsg = "Invalid Order";
    else {
      let order: Order = new Order();
      order.symbol = this.symbol;
      order.side = this.side;
      order.price = this.price;
      order.quantity = this.quantity;

      this.orders.push(order);
      this.refreshGridData();
      this.dataGridOptions.api.refreshCells();
    }
  }
}

class OrderBook {
  Symbol: string;
  Side: string;
  Price: number;
  Quantity: number;
  OrderCount: number;
}