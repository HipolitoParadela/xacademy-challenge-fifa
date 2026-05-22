import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  BaseChartDirective,
} from 'ng2-charts';

import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineController,
  RadarController,
} from 'chart.js';

import { PlayersService } from '../../core/services/players.service';
import { FifaVersionService } from '../../core/services/fifaversion.service';
import { PlayerSkillsService } from '../../core/services/player-skills.service';
import { PlayerSkillsEditorComponent } from '../../components/player-skills-editor/player-skills-editor.component';
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineController,
  RadarController,
);

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    PlayerSkillsEditorComponent,
  ],
  templateUrl:
    './player-profile.component.html',
})
export class PlayerProfileComponent
  implements OnInit {

  private route =
    inject(ActivatedRoute);

  private router =
    inject(Router);

  private playersService =
    inject(PlayersService);

  private fifaService =
    inject(FifaVersionService);

  private skillsService =
    inject(PlayerSkillsService);

  playerId = 0;
  profile: any = {};
  versions: any[] = [];
  selectedVersion = 0;
  skills: any = {};
  evolution: any[] = [];
  showEditor = false;

  reloadProfile() {
    this.loadProfile();
    this.loadEvolution();
  }

  radarData:
    ChartData<'radar'> = {
      labels: [],
      datasets: [],
    };

  evolutionData:
    ChartData<'line'> = {
      labels: [],
      datasets: [],
    };

  // ===== RADAR OPTIONS =====

  radarOptions:
    ChartOptions<'radar'> = {
      responsive: true,

      maintainAspectRatio:
        false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor:
            '#111827',

          borderColor:
            '#00FF9D',

          borderWidth: 1,

          titleColor:
            '#ffffff',

          bodyColor:
            '#00FF9D',
        },
      },

      scales: {
        r: {
          min: 0,
          max: 100,

          ticks: {
            display: false,
            stepSize: 20,
          },

          grid: {
            color:
              'rgba(255,255,255,.06)',
          },

          angleLines: {
            color:
              'rgba(255,255,255,.08)',
          },

          pointLabels: {
            color:
              '#E5E7EB',

            font: {
              size: 14,
              weight: 700,
            },
          },
        },
      },
    };

  // ===== LINE OPTIONS =====

  lineOptions:
    ChartOptions<'line'> = {

      responsive: true,

      maintainAspectRatio:
        true,

      aspectRatio: 2.2,

      interaction: {
        mode: 'index',
        intersect: false,
      },

      plugins: {

        legend: {

          position: 'top',

          labels: {
            color: '#E5E7EB',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
          },
        },

        tooltip: {

          backgroundColor:
            '#111827',

          borderColor:
            '#00FF9D',

          borderWidth: 1,

          titleColor:
            '#ffffff',

          bodyColor:
            '#E5E7EB',
        },
      },

      scales: {

        x: {

          ticks: {
            color: '#94a3b8',
          },

          grid: {
            color:
              'rgba(255,255,255,.04)',
          },
        },

        y: {

          min: 0,
          max: 100,

          ticks: {
            color: '#94a3b8',
            stepSize: 20,
          },

          grid: {
            color:
              'rgba(255,255,255,.05)',
          },
        },
      },
    };

  ngOnInit() {

    this.playerId =
      Number(
        this.route.snapshot.paramMap.get(
          'id',
        ),
      );

    this.loadProfile();
    this.loadVersions();
    this.loadEvolution();
  }

  loadProfile() {

    this.playersService
      .getProfile(
        this.playerId,
      )
      .subscribe((res) => {

        console.log(
          'loadProfile',
          res,
        );

        this.profile = res;

        this.skills =
          res.skills || {};

        this.selectedVersion =
          res.fifa_version?.id || 0;

        this.buildRadar();
      });
  }

  loadVersions() {

    this.fifaService
      .getFifaVersions()
      .subscribe((res) => {

        this.versions =
          res.sort(
            (
              a: any,
              b: any,
            ) =>
              Number(
                b.version_number,
              ) -
              Number(
                a.version_number,
              ),
          );
      });
  }

  loadSkills() {

    if (
      !this.selectedVersion
    ) {
      return;
    }

    this.skillsService
      .getPlayerSkills(
        this.playerId,
        this.selectedVersion,
      )
      .subscribe((res) => {

        console.log(
          'loadSkills',
          res,
        );

        this.skills =
          res || {};

        this.buildRadar();
      });
  }

  loadEvolution() {

    this.playersService
      .getEvolution(
        this.playerId,
      )
      .subscribe((res) => {

        console.log(
          'evolution',
          res,
        );

        this.evolution =
          res || [];

        this.buildEvolution();
      });
  }

  // ===== RADAR =====

  buildRadar() {

    console.log(
      'radar skills',
      this.skills,
    );

    this.radarData = {
      labels: [
        'RIT',
        'TIR',
        'PAS',
        'REG',
        'DEF',
        'FIS',
      ],

      datasets: [
        {
          label:
            'Attributes',

          data: [
            Number(
              this.skills
                .pace || 0,
            ),

            Number(
              this.skills
                .shooting || 0,
            ),

            Number(
              this.skills
                .passing || 0,
            ),

            Number(
              this.skills
                .dribbling || 0,
            ),

            Number(
              this.skills
                .defending || 0,
            ),

            Number(
              this.skills
                .physic || 0,
            ),
          ],

          backgroundColor:
            'rgba(0,255,157,.18)',

          borderColor:
            '#00FF9D',

          borderWidth: 3,

          pointBackgroundColor:
            '#00FF9D',

          pointBorderColor:
            '#ffffff',

          pointRadius: 5,

          pointHoverRadius: 8,

          pointHoverBackgroundColor:
            '#00FF9D',

          pointHoverBorderColor:
            '#ffffff',

          fill: true,
        },
      ],
    };
  }

  // ===== EVOLUTION =====

  buildEvolution() {

    const sorted =
      [...this.evolution]
        .sort(
          (
            a: any,
            b: any,
          ) =>
            Number(
              a.fifa_version
                .version_number,
            ) -
            Number(
              b.fifa_version
                .version_number,
            ),
        );

    this.evolutionData = {

      labels:
        sorted.map(
          (
            e: any,
          ) =>
            `FIFA ${e.fifa_version.version_number}`,
        ),

      datasets: [

        {
          label: 'RIT',

          data:
            sorted.map(
              (
                e: any,
              ) =>
                Number(
                  e.skills?.pace || 0,
                ),
            ),

          borderColor:
            '#22C55E',

          backgroundColor:
            '#22C55E',

          tension: .35,

          pointRadius: 4,
        },

        {
          label: 'TIR',

          data:
            sorted.map(
              (
                e: any,
              ) =>
                Number(
                  e.skills?.shooting || 0,
                ),
            ),

          borderColor:
            '#EF4444',

          backgroundColor:
            '#EF4444',

          tension: .35,

          pointRadius: 4,
        },

        {
          label: 'PAS',

          data:
            sorted.map(
              (
                e: any,
              ) =>
                Number(
                  e.skills?.passing || 0,
                ),
            ),

          borderColor:
            '#3B82F6',

          backgroundColor:
            '#3B82F6',

          tension: .35,

          pointRadius: 4,
        },

        {
          label: 'REG',

          data:
            sorted.map(
              (
                e: any,
              ) =>
                Number(
                  e.skills?.dribbling || 0,
                ),
            ),

          borderColor:
            '#F59E0B',

          backgroundColor:
            '#F59E0B',

          tension: .35,

          pointRadius: 4,
        },

        {
          label: 'FIS',

          data:
            sorted.map(
              (
                e: any,
              ) =>
                Number(
                  e.skills?.physic || 0,
                ),
            ),

          borderColor:
            '#A855F7',

          backgroundColor:
            '#A855F7',

          tension: .35,

          pointRadius: 4,
        },
      ],
    };
  }

  changeVersion(
    versionId: number,
  ) {

    console.log(
      'changeVersion',
      versionId,
    );

    this.selectedVersion =
      versionId;

    this.loadSkills();
  }

  goBack() {

    this.router.navigate([
      '/dashboard',
    ]);
  }
}