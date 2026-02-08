import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-catalog-layout',
  imports: [RouterOutlet],
  templateUrl: './catalog-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogLayout { }
