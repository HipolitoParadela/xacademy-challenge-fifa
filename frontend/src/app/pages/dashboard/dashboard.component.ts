import { Component, OnInit, } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PositionsService, } from '../../core/services/position.service';
import { ClubsService, } from '../../core/services/clubs.service';
import { FifaVersionService, } from '../../core/services/fifaversion.service';
import { PlayersService, } from '../../core/services/players.service';
import { Position, } from '../../shared/models/position.model';
import { Club, } from '../../shared/models/club.model';
import { FifaVersion, } from '../../shared/models/fifaversion.model';
import { Player, } from '../../shared/models/player.model';
import { PlayerModalComponent } from '../../components/player-modal/player-modal.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlayerModalComponent,
  ],
  templateUrl:
    './dashboard.component.html',
})


export class DashboardComponent implements OnInit {

  positions: string[] = [];
  fifaVersions: FifaVersion[] = [];
  clubs: Club[] = [];
  selectedPositions: string[] = [];
  selectedFifa = '';
  selectedClub = '';
  gender = 'all';
  mobileFilters = false;
  players: Player[] = [];
  total = 0;
  page = 0;
  limit = 20;
  loading = false;
  search = '';
  totalPlayers = 0;
  modalOpen = false;
  editingPlayer: any = null;

  constructor(
    private positionsService: PositionsService,
    private clubsService: ClubsService,
    private fifaVersionService: FifaVersionService,
    private playersService: PlayersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadFilters();
    this.loadPlayers();
  }

  loadFilters() {

    this.positionsService
      .getPositions()
      .subscribe(
        (
          data: Position[],
        ) => {
          this.positions =
            data.map(
              (p) =>
                p.code,
            );
        },
      );

    this.clubsService
      .getClubs()
      .subscribe(
        (
          data: Club[],
        ) => {
          this.clubs =
            data;
        },
      );

    this.fifaVersionService
      .getFifaVersions()
      .subscribe(
        (
          data:
            FifaVersion[],
        ) => {
          this.fifaVersions =
            data;
        },
      );


  }

  loadPlayers() {

    this.loading = true;

    console.log("loadPlayers", this.selectedClub, this.selectedFifa, this.selectedPositions, this.gender, this.search);



    this.playersService
      .getPlayers({
        limit: this.limit,
        offset:
          this.page *
          this.limit,
        position:
          this.selectedPositions[0],
        clubId:
          this.selectedClub,
        fifaVersionId:
          this.selectedFifa,
        gender:
          this.gender,
        search:
          this.search,
      })

      .subscribe({
        next:
          (
            res,
          ) => {
            this.players =
              res.rows;

            this.total =
              res.count;

            this.loading =
              false;

            this.totalPlayers =
              res.count;
          },

        error: () => {
          this.loading =
            false;
        },
      });
  }

  togglePosition(
    pos: string,
  ) {
    if (
      this.selectedPositions.includes(
        pos,
      )
    ) {
      this.selectedPositions =
        this.selectedPositions.filter(
          (p) =>
            p !== pos,
        );
    } else {
      this.selectedPositions =
        [pos];
    }

    this.page = 0;

    this.loadPlayers();
  }

  selectFifa(v: string) {
    this.selectedFifa = v;
    this.page = 0;
    this.loadPlayers();
  }

  selectClub(
    clubId: string,
  ) {
    this.selectedClub = clubId;

    this.page = 0;

    this.loadPlayers();
  }

  onSearch() {
    this.page = 0;
    this.loadPlayers();
  }

  get totalPages(): number {
    return Math.ceil(
      this.totalPlayers / this.limit,
    );
  }

  get currentPage(): number {
    return this.page + 1;
  }

  get visiblePages(): number[] {
    const total =
      this.totalPages;

    const current =
      this.currentPage;

    let start =
      Math.max(
        1,
        current - 2,
      );

    let end =
      Math.min(
        total,
        start + 4,
      );

    if (
      end - start <
      4
    ) {
      start =
        Math.max(
          1,
          end - 4,
        );
    }

    return Array.from(
      {
        length:
          end -
          start +
          1,
      },
      (_, i) =>
        start + i,
    );
  }

  get startItem(): number {
    return (
      this.page *
      this.limit +
      1
    );
  }

  get endItem(): number {
    return Math.min(
      (this.page + 1) *
      this.limit,
      this.totalPlayers,
    );
  }

  goToPage(
    page: number,
  ) {
    if (
      page < 0 ||
      page >=
      this.totalPages
    ) {
      return;
    }

    this.page = page;
    this.loadPlayers();
  }

  prevPage() {
    this.goToPage(
      this.page - 1,
    );
  }

  nextPage() {
    this.goToPage(
      this.page + 1,
    );
  }

  exportToExcel() {
    if (!this.players.length) {
      return;
    }

    const data =
      this.players.map(
        (p: any) => ({
          Player: p.name,
          Club: p.club,
          Gender: p.genero,
          Position:
            p.player_positions,
          Overall:
            p.overall,
          Potential:
            p.potential,
          Age: p.age,
          Value_EUR:
            p.value_eur,
        }),
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data,
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Players',
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType:
            'xlsx',
          type:
            'array',
        },
      );

    const blob =
      new Blob(
        [excelBuffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        },
      );

    saveAs(
      blob,
      `players_${new Date()
        .toISOString()
        .slice(
          0,
          10,
        )}.xlsx`,
    );
  }

  // Funciones del modal para crear o editar jugadores
  openCreate() {
    this.editingPlayer =
      null;

    this.modalOpen =
      true;
  }

  openEdit(player: any) {

    console.log("openEdit", player);
    
    this.editingPlayer =
      player;

    this.modalOpen =
      true;
  }

  savePlayer(
    data: any,
  ) {

    console.log("savePlayer", data);
    
    const isEdit = !!this.editingPlayer;

    const request =
      isEdit
        ? this.playersService.update(
          this.editingPlayer.id,
          data,
        )
        : this.playersService.create(
          data,
        );

    request.subscribe({
      next: (res: any) => {

        console.log(
          'savePlayer response',
          res,
        );

        this.modalOpen =
          false;

        // ===== EDIT =====
        if (isEdit) {

          this.loadPlayers();

          return;
        }

        // ===== CREATE =====

        const playerId =
          res?.id ||
          res?.player?.id ||
          res?.data?.id;

        console.log(
          'NEW PLAYER ID',
          playerId,
        );

        if (playerId) {

          this.router.navigate([
            '/player',
            playerId,
          ]);

          return;
        }

        console.error(
          'No player id returned',
          res,
        );

        this.loadPlayers();
      },

      error: (err) => {

        console.error(
          'savePlayer error',
          err,
        );
      },
    });
  }

  openPlayer(
    player: any,
  ) {
    this.router.navigate([
      '/player',
      player.id,
    ]);
  }


}