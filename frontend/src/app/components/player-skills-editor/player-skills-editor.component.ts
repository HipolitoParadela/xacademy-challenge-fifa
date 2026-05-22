import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FifaVersionService } from '../../core/services/fifaversion.service';
import { PlayerSkillsService } from '../../core/services/player-skills.service';

@Component({
  selector: 'app-player-skills-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl:
    './player-skills-editor.component.html',
  styleUrl:
    './player-skills-editor.component.css',
})
export class PlayerSkillsEditorComponent
  implements OnInit {

  @Input()
  playerId!: number;

  @Output()
  close =
    new EventEmitter<void>();

  @Output()
  saved =
    new EventEmitter<void>();

  private fifaService =
    inject(FifaVersionService);

  private skillsService =
    inject(PlayerSkillsService);

  versions: any[] = [];

  selectedVersion = 0;

  loading = false;

  skills: any = {
    pace: 0,
    shooting: 0,
    passing: 0,
    dribbling: 0,
    defending: 0,
    physic: 0,
    overall: 0,
    potential: 0,

    age: 25,
    value_eur: 120000000,
    player_positions: 'ST',
    club_team_id: 241,
  };

  ngOnInit() {
    this.loadVersions();
  }

  loadVersions() {
    this.fifaService
      .getFifaVersions()
      .subscribe((res) => {

        this.versions =
          res.sort(
            (a: any, b: any) =>
              Number(
                b.version_number,
              ) -
              Number(
                a.version_number,
              ),
          );

        if (
          this.versions.length
        ) {

          this.selectedVersion =
            this.versions[0].id;

          this.loadSkills();
        }
      });
  }

  loadSkills() {

    if (
      !this.selectedVersion
    ) {
      return;
    }

    this.loading = true;

    this.skillsService
      .getPlayerSkills(
        this.playerId,
        this.selectedVersion,
      )
      .subscribe({
        next: (res) => {

          this.skills = {
            pace:
              res?.pace || 0,

            shooting:
              res?.shooting || 0,

            passing:
              res?.passing || 0,

            dribbling:
              res?.dribbling || 0,

            defending:
              res?.defending || 0,

            physic:
              res?.physic || 0,

            overall:
              res?.overall || 0,

            potential:
              res?.potential || 0,

            age:
              res?.age || 25,

            value_eur:
              res?.value_eur ||
              120000000,

            player_positions:
              res?.player_positions ||
              'ST',

            club_team_id:
              res?.club_team_id ||
              241,
          };

          this.loading =
            false;
        },

        error: () => {

          this.skills = {
            pace: 0,
            shooting: 0,
            passing: 0,
            dribbling: 0,
            defending: 0,
            physic: 0,
            overall: 0,
            potential: 0,
            age: 25,
            value_eur: 120000000,
            player_positions: 'ST',
            club_team_id: 241,
          };

          this.loading =
            false;
        },
      });
  }

  save() {

    const payload = {
      ...this.skills,
      player_id:
        this.playerId,

      fifa_version_id:
        this.selectedVersion,
    };

    this.skillsService
      .savePlayerSkills(
        this.playerId,
        this.selectedVersion,
        this.skills,
      )
      .subscribe(() => {

        this.saved.emit();
        this.close.emit();

      });
  }
}