#!/usr/bin/env python3
"""
Script to create comprehensive loan examples for all users.
Each user will have 4 loan scenarios:
1. Active loan where user is lender (someone owes them money)
2. Partially repaid loan where user is lender (someone has partially repaid)
3. Active loan where user is borrower (user owes money)
4. Fully repaid loan where user is borrower (user has fully repaid)
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app
from app.extensions import db
from app.models import User, Loan, LoanRepayment, Wallet
from datetime import datetime, timedelta
from decimal import Decimal
import random

def create_loan_examples():
    app = create_app()
    
    with app.app_context():
        # Get all users
        users = User.query.order_by(User.id).all()
        print(f"Found {len(users)} users")
        
        if len(users) < 2:
            print("Need at least 2 users to create loans")
            return
        
        # Clear existing loans
        print("Clearing existing loans...")
        Loan.query.delete()
        LoanRepayment.query.delete()
        db.session.commit()
        
        loan_count = 0
        
        for i, user in enumerate(users):
            print(f"\nCreating loans for {user.username} (ID: {user.id})...")
            
            # Pick other users for the loan scenarios (round-robin style)
            other_users = [u for u in users if u.id != user.id]
            if len(other_users) < 4:
                # If not enough users, reuse them
                other_idx_1 = i % len(other_users)
                other_idx_2 = (i + 1) % len(other_users)
                other_idx_3 = (i + 2) % len(other_users)
                other_idx_4 = (i + 3) % len(other_users)
            else:
                other_idx_1 = i % len(other_users)
                other_idx_2 = (i + 1) % len(other_users)
                other_idx_3 = (i + 2) % len(other_users)
                other_idx_4 = (i + 3) % len(other_users)
            
            borrower_1 = other_users[other_idx_1]
            borrower_2 = other_users[other_idx_2]
            lender_1 = other_users[other_idx_3]
            lender_2 = other_users[other_idx_4]
            
            # Scenario 1: Active loan where user is lender (someone owes them)
            loan1 = Loan(
                lender_id=user.id,
                borrower_id=borrower_1.id,
                amount=Decimal('150.00'),
                amount_repaid=Decimal('0.00'),
                status='active',
                description=f'Textbooks loan to {borrower_1.username}',
                due_date=(datetime.now() + timedelta(days=30)).date(),
                is_fully_repaid=False,
                created_at=datetime.now() - timedelta(days=5)
            )
            db.session.add(loan1)
            loan_count += 1
            print(f"  1. Created active loan: {user.username} lent $150 to {borrower_1.username}")
            
            # Scenario 2: Partially repaid loan where user is lender
            loan2 = Loan(
                lender_id=user.id,
                borrower_id=borrower_2.id,
                amount=Decimal('200.00'),
                amount_repaid=Decimal('75.00'),
                status='active',
                description=f'Tuition help for {borrower_2.username}',
                due_date=(datetime.now() + timedelta(days=45)).date(),
                is_fully_repaid=False,
                created_at=datetime.now() - timedelta(days=15)
            )
            db.session.add(loan2)
            loan_count += 1
            print(f"  2. Created partially repaid loan: {user.username} lent $200 to {borrower_2.username}, $75 repaid")
            
            # Create repayment record for loan2
            repayment1 = LoanRepayment(
                loan_id=loan2.id,
                amount=Decimal('75.00'),
                created_at=datetime.now() - timedelta(days=7)
            )
            # We'll add this after flushing to get loan2.id
            
            # Scenario 3: Partially repaid loan where user is borrower (user has made partial repayments)
            loan3 = Loan(
                lender_id=lender_1.id,
                borrower_id=user.id,
                amount=Decimal('100.00'),
                amount_repaid=Decimal('40.00'),
                status='active',
                description=f'Emergency fund borrowed from {lender_1.username}',
                due_date=(datetime.now() + timedelta(days=20)).date(),
                is_fully_repaid=False,
                created_at=datetime.now() - timedelta(days=10)
            )
            db.session.add(loan3)
            loan_count += 1
            print(f"  3. Created partially repaid loan: {user.username} borrowed $100 from {lender_1.username}, $40 repaid")
            
            # Scenario 4: Fully repaid loan where user is borrower
            loan4 = Loan(
                lender_id=lender_2.id,
                borrower_id=user.id,
                amount=Decimal('80.00'),
                amount_repaid=Decimal('80.00'),
                status='repaid',
                description=f'Book purchase repaid to {lender_2.username}',
                due_date=(datetime.now() - timedelta(days=5)).date(),
                is_fully_repaid=True,
                repaid_at=datetime.now() - timedelta(days=2),
                created_at=datetime.now() - timedelta(days=25)
            )
            db.session.add(loan4)
            loan_count += 1
            print(f"  4. Created fully repaid loan: {user.username} borrowed $80 from {lender_2.username} and fully repaid")
            
            # Flush to get IDs
            db.session.flush()
            
            # Now add repayment for loan2 (user is lender, received partial payment)
            repayment1.loan_id = loan2.id
            db.session.add(repayment1)
            
            # Create repayment records for loan3 (user is borrower, made partial payment)
            repayment2 = LoanRepayment(
                loan_id=loan3.id,
                amount=Decimal('40.00'),
                created_at=datetime.now() - timedelta(days=4)
            )
            db.session.add(repayment2)
            
            # Create repayment records for loan4 (user is borrower, fully repaid)
            repayment3 = LoanRepayment(
                loan_id=loan4.id,
                amount=Decimal('50.00'),
                created_at=datetime.now() - timedelta(days=10)
            )
            repayment4 = LoanRepayment(
                loan_id=loan4.id,
                amount=Decimal('30.00'),
                created_at=datetime.now() - timedelta(days=2)
            )
            db.session.add(repayment3)
            db.session.add(repayment4)
        
        # Commit all loans
        db.session.commit()
        print(f"\n✅ Successfully created {loan_count} loans for {len(users)} users!")
        print(f"   Each user has 4 loan scenarios demonstrating different statuses.")

if __name__ == '__main__':
    create_loan_examples()
