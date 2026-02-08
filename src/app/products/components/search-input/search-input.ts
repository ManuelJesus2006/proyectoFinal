import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput { 
  placeholder = input<string>('Introduce valor para buscar')
  value = output<string>()
}
