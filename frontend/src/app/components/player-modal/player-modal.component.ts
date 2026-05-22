import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl:
    './player-modal.component.html',
})
export class PlayerModalComponent
  implements OnChanges {
  private fb =
    inject(FormBuilder);

  @Input()
  visible = false;

  @Input()
  player: any = null;

  @Output()
  close =
    new EventEmitter();

  @Output()
  save =
    new EventEmitter<any>();

  form =
    this.fb.nonNullable.group({
      external_id: [0],
      name: [
        '',
        Validators.required,
      ],

      genero: ['male'],

      image: [''],
    });

  ngOnChanges() {
    if (this.player) {
      this.form.patchValue({
        external_id: this.player.external_id,
        name: this.player.name,
        genero:
          this.player.genero,
        image:
          this.player.image,
      });
    } else {
      this.form.reset({
        external_id: 0,
        genero: 'male',
      });
    }
  }

  submit() {

    if (
      this.form.invalid
    ) {
      return;
    }

    const payload =
      this.form.getRawValue();

    /* console.log(
      'PLAYER PAYLOAD',
      payload,
    ); */

    this.save.emit(
      payload,
    );
  }
}