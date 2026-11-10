import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';

import { CitaCardComponent } from './cita-card.component';

describe('CitaCardComponent', () => {
  let component: CitaCardComponent;
  let fixture: ComponentFixture<CitaCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitaCardComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(CitaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
