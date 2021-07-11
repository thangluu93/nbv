import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {CartService} from '../../services/cart.service';
import {Item} from '../../constant/interface';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private menuService: MenuService, private route: ActivatedRoute, private cartService: CartService) {
  }

  image = [];
  productDetails: Item = {
    editable: false,
    id: '',
    name: {
      vi: '',
      en: ''
    },
    price: 0,
    price_str: '',
    quantity: 0
  };
  list_size: any[] = [];
  list_color: any[] = [];
  selected_size: Object = {};
  selected_color: Object = {};
  previewImageSub: Observable<any> = new Observable<any>();
  @ViewChild('addToCartRef') addToCartRef: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: any) => {
      let prod = param.params;
      if (prod.id) {
        this.getProductDetail(prod.id);
      }
    });
  }

  getProductDetail(id: string) {
    this.menuService.getProductDetails(id).subscribe((res: any) => {
      if (!res.error) {
        // console.log(res.data);
        let data = res.data;
        this.image = data.image;
        this.previewImageSub = of(this.image[0]);
        if (data.size) {
          this.list_size = data.size.items;
        }
        if (data.color) {
          this.list_color = data.color.items;
        }
        return this.productDetails = res.data;
      }
    });
  }

  previewImage(image: string) {
    this.previewImageSub = of(image);
  }

  selectSize(size: object) {
    this.selected_size = size;
  }

  selectColor(color: object) {
    this.selected_color = color;
  }

  addToCart() {
    (<HTMLElement> this.addToCartRef.nativeElement).textContent = 'ADDED!!!';
    setTimeout(() => {
      (<HTMLElement> this.addToCartRef.nativeElement).textContent = 'add to bag';
    }, 800);
    let item = {
      id: this.productDetails.id,
      product_name: this.productDetails.name,
      price: this.productDetails.price,
      quantity: 1,
      size: this.selected_size,
      color: this.selected_color
    };
    this.cartService.addToCart(item);
  }
}
