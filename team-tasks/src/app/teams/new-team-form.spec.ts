import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeamFormComponent } from './new-team-form.component';

describe('NewTeamForm', () => {
  let component: NewTeamFormComponent;
  let fixture: ComponentFixture<NewTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTeamFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTeamFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
