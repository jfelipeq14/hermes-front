/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'hero-widget',
  imports: [ButtonModule, RippleModule, CarouselModule, TagModule],
  template: `
    <div
      class="flex flex-column w-full align-items-center justify-content-center"
    >
      <div class="text-center">
        <h1 class=" font-bold text-gray-900 leading-tight">Parche Travels</h1>
        <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
          Disfruta de un parche lleno de travels
        </p>
      </div>
      <div class="flex justify-content-center">
        <div class="card bg-transparent">
          <p-carousel
            [value]="packages"
            [numVisible]="3"
            [numScroll]="3"
            [circular]="false"
            [responsiveOptions]="carouselResponsiveOptions"
          >
            <ng-template let-product #item>
              <div class="border border-surface rounded-border m-2 p-2">
                <div class="mb-4">
                  <div class="relative mx-auto">
                    <img
                      src="http://localhost:3000/{{ product.image }}"
                      [alt]="product.name"
                      class="w-full rounded-border"
                    />
                    <div class="absolute bg-black/70 rounded-border">
                      <p-tag [value]="product.inventoryStatus" />
                    </div>
                  </div>
                </div>
                <div class="mb-4 font-medium">{{ product.name }}</div>
                <div class="flex justify-between align-items-center">
                  <div class="mt-0 font-semibold text-xl">
                    {{ '$' + product.price }}
                  </div>
                  <span>
                    <p-button icon="pi pi-ticket"> Reservar </p-button>
                  </span>
                </div>
              </div>
            </ng-template>
          </p-carousel>
        </div>
      </div>
    </div>
  `,
})
export class HeroWidget {
  packages = [
    {
      id: 1,
      name: 'Package 1',
      price: 100,
      inventoryStatus: 'INSTOCK',
      image: 'images/1.png',
    },
    {
      id: 2,
      name: 'Package 2',
      price: 200,
      inventoryStatus: 'LOWSTOCK',
      image: 'images/2.png',
    },
    {
      id: 3,
      name: 'Package 3',
      price: 300,
      inventoryStatus: 'OUTOFSTOCK',
      image: 'images/3.png',
    },
    {
      id: 4,
      name: 'Package 4',
      price: 400,
      inventoryStatus: 'INSTOCK',
      image: 'images/4.png',
    },
    {
      id: 5,
      name: 'Package 5',
      price: 500,
      inventoryStatus: 'LOWSTOCK',
      image: 'images/5.png',
    },
    {
      id: 6,
      name: 'Package 6',
      price: 600,
      inventoryStatus: 'OUTOFSTOCK',
      image: 'images/6.png',
    },
  ];

  images!: any[];

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  // constructor() {}

  // ngOnInit() {}
}
