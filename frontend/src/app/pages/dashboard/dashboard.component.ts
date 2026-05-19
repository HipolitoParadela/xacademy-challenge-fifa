import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PositionsService } from '../../core/services/position.service';
import { Position } from '../../shared/models/position.model';
import { ClubsService } from '../../core/services/clubs.service';
import { Club } from '../../shared/models/club.model';
import { FifaVersionService } from '../../core/services/fifaversion.service';
import { FifaVersion } from '../../shared/models/fifaversion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // --- Datos dinámicos desde backend ---
  positions: string[] = [];
  selectedPositions: string[] = [];
  clubs: string[] = [];
  selectedClubs: string[] = [];
  fifaVersions: string[] = [];
  selectedFifa = '';

  // --- Estados y datos adicionales ---
  mobileFilters = false;

  
  gender = 'all';
  club = '';

  players = [
    {
      image: 'https://placehold.co/80',
      name: 'Kylian Mbappé',
      club: 'PSG',
    },
    {
      image: 'https://placehold.co/80',
      name: 'Jude Bellingham',
      club: 'Real Madrid',
    },
  ];

  constructor(private positionsService: PositionsService, private clubsService: ClubsService, private fifaVersionService: FifaVersionService) {}
  

  ngOnInit() {
    this.positionsService.getPositions().subscribe((data: Position[]) => {
      this.positions = data.map((p) => p.code);
    });
    this.clubsService.getClubs().subscribe((data: Club[]) => {
      this.clubs = data.map((c) => c.name);
    });
    this.fifaVersionService.getFifaVersions().subscribe((data: FifaVersion[]) => {
      this.fifaVersions = data.map((p) => p.version_number.toString());
    });
  }

  togglePosition(pos: string) {
    if (this.selectedPositions.includes(pos)) {
      this.selectedPositions = this.selectedPositions.filter((p) => p !== pos);
    } else {
      this.selectedPositions.push(pos);
    }
  }

  selectFifa(v: string) {
    this.selectedFifa = v;
  }
}