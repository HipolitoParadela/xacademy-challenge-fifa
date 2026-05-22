import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSkillsEditor } from './player-skills-editor.component';

describe('PlayerSkillsEditor', () => {
  let component: PlayerSkillsEditor;
  let fixture: ComponentFixture<PlayerSkillsEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSkillsEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSkillsEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
